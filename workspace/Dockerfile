FROM ubuntu:22.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# 1. Base tools and system updates
RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    zsh \
    nano \
    vim \
    htop \
    tree \
    jq \
    unzip \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# 2. Create non-root user
RUN useradd -m -s /bin/zsh coder && \
    usermod -aG sudo coder && \
    echo 'coder ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# 3. Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

# 4. Install Python 3.11
RUN add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.11 python3.11-pip python3.11-venv && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 && \
    update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1

# 5. Install Go 1.21
RUN GO_VERSION="1.21.5" && \
    wget https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz && \
    rm go${GO_VERSION}.linux-amd64.tar.gz && \
    ln -sf /usr/local/go/bin/go /usr/local/bin/

# 6. Install Docker-in-Docker (rootless setup)
RUN curl -fsSL https://get.docker.com | sh && \
    systemctl enable docker && \
    usermod -aG docker coder

# 7. Install additional development tools
# kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    rm kubectl

# helm
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# docker-compose
RUN curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# 8. Install Dev Containers CLI
RUN curl -fsSL https://github.com/devcontainers/cli/releases/latest/download/devcontainer-linux-amd64 \
    -o /usr/local/bin/devcontainer && \
    chmod +x /usr/local/bin/devcontainer

# 9. Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# 10. Install VS Code Server
RUN VERSION=$(curl -s https://api.github.com/repos/gitpod-io/openvscode-server/releases/latest | grep tag_name | cut -d '"' -f 4) && \
    wget https://github.com/gitpod-io/openvscode-server/releases/download/${VERSION}/openvscode-server-${VERSION}-linux-x64.tar.gz && \
    tar -xzf openvscode-server-${VERSION}-linux-x64.tar.gz -C /opt && \
    rm openvscode-server-${VERSION}-linux-x64.tar.gz && \
    ln -sf /opt/openvscode-server-${VERSION}-linux-x64/bin/openvscode-server /usr/local/bin/code-server

# 11. Setup user environment
USER coder
WORKDIR /home/coder

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Create useful directories
RUN mkdir -p /home/coder/workspace/projects && \
    mkdir -p /home/coder/workspace/data && \
    mkdir -p /home/coder/workspace/models && \
    mkdir -p /home/coder/.local/bin

# Setup shell configuration
RUN echo 'export PATH=$PATH:/usr/local/bin:/opt/openvscode-server-*/bin' >> ~/.zshrc && \
    echo 'export WORKSPACE_DIR=/home/coder/workspace' >> ~/.zshrc && \
    echo 'export OLLAMA_HOST=http://localhost:11434' >> ~/.zshrc && \
    echo 'export ULTRA_DEVBOX=true' >> ~/.zshrc && \
    echo 'alias ll="ls -la"' >> ~/.zshrc && \
    echo 'alias dev="cd /home/coder/workspace/projects"' >> ~/.zshrc && \
    echo 'alias models="cd /home/coder/workspace/models"' >> ~/.zshrc && \
    echo 'alias start-devbox="/home/coder/workspace/start.sh"' >> ~/.zshrc

# 12. Create startup script
RUN cat > /home/coder/workspace/start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Ultra DevBox services..."

# Start Ollama if not running
if ! pgrep -f "ollama serve" > /dev/null; then
    echo "Starting Ollama..."
    ollama serve &
    sleep 3
fi

# Start VS Code Server if not running
if ! pgrep -f "code-server" > /dev/null; then
    echo "Starting VS Code Server..."
    code-server --bind-addr 0.0.0.0:8080 --auth none --disable-telemetry &
fi

echo "✅ Services started!"
echo "📱 VS Code: http://localhost:8080"
echo "🤖 Ollama: http://localhost:11434"
EOF

RUN chmod +x /home/coder/workspace/start.sh

# 13. Pull default LLM model (will be done on first run)
RUN echo "#!/bin/bash" > /home/coder/workspace/setup-ai.sh && \
    echo "ollama pull codellama:13b-instruct" >> /home/coder/workspace/setup-ai.sh && \
    echo "echo '🤖 CodeLlama 13B model ready!'" >> /home/coder/workspace/setup-ai.sh && \
    chmod +x /home/coder/workspace/setup-ai.sh

# 14. Create sample project
RUN mkdir -p /home/coder/workspace/projects/hello-ultra-devbox && \
    cat > /home/coder/workspace/projects/hello-ultra-devbox/package.json << 'EOFPACKAGE'
{
  "name": "hello-ultra-devbox",
  "version": "1.0.0",
  "description": "Sample project for Ultra DevBox",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["ultra-devbox", "sample"],
  "author": "Ultra DevBox",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOFPACKAGE

RUN cat > /home/coder/workspace/projects/hello-ultra-devbox/index.js << 'EOFINDEX'
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Hello from Ultra DevBox!',
    features: [
      'Docker-in-Docker support',
      'AI-powered development',
      'VS Code in browser',
      'Multi-service applications'
    ],
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Ultra DevBox sample app running on port ${port}`);
});
EOFINDEX

RUN cat > /home/coder/workspace/projects/hello-ultra-devbox/README.md << 'EOFREADME'
# Hello Ultra DevBox

This is a sample project to demonstrate Ultra DevBox capabilities.

## Quick Start

\`\`\`bash
npm install
npm start
\`\`\`

Then visit http://localhost:3000 to see your app running!

## Ultra DevBox Features

- 🐳 **Docker-in-Docker**: Build and run containers
- 🤖 **AI Assistant**: Use CodeLlama for intelligent coding
- 💻 **VS Code**: Full IDE experience in browser
- 🚀 **Multi-service**: Run complex applications

## AI Integration

Try the AI assistant:

\`\`\`bash
ollama run codellama:13b-instruct
\`\`\`

Ask it to help you improve this code!
EOFREADME

# 15. Create welcome message
RUN cat > /home/coder/.welcome << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║                    🚀 Ultra DevBox Ready!                    ║
╠══════════════════════════════════════════════════════════════╣
║  Your development environment is now fully configured!       ║
║                                                              ║
║  🐳 Docker-in-Docker:     Available                          ║
║  🤖 AI Assistant (Ollama): http://localhost:11434            ║
║  💻 VS Code Server:       http://localhost:8080              ║
║  📁 Workspace:            /home/coder/workspace               ║
║                                                              ║
║  Quick Start Commands:                                       ║
║  • start-devbox   - Start all services                       ║
║  • dev            - Navigate to projects directory            ║
║  • models         - Navigate to models directory              ║
║  • ollama list    - List available AI models                  ║
║  • docker ps      - List running containers                   ║
║                                                              ║
║  AI Model Setup:                                             ║
║  • Run 'setup-ai.sh' to pull CodeLlama model                ║
║  • Install Continue extension for AI assistance              ║
║                                                              ║
║  Happy coding! 🎉                                           ║
╚══════════════════════════════════════════════════════════════╝
EOF

# Switch back to workspace directory
WORKDIR /home/coder/workspace

# Expose ports
EXPOSE 8080 11434 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

# Default command
CMD ["/bin/zsh"]