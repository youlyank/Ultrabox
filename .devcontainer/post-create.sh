#!/usr/bin/env bash

set -e

echo "🚀 Initializing Ultra DevBox workspace..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running in devcontainer
if [ ! -f "/workspaces/.codespaces-shared" ] && [ ! -f "/workspaces/.devcontainer.json" ]; then
    print_warning "Not running in a Dev Container. Some features may not work as expected."
fi

# Step 1: Install Ollama
print_step "Installing Ollama..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.ai/install.sh | sh
    print_status "Ollama installed successfully"
else
    print_status "Ollama already installed"
fi

# Step 2: Start Ollama service in background
print_step "Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!
sleep 5

# Step 3: Pull default LLM model
print_step "Pulling CodeLlama 13B model (this may take a few minutes)..."
if ollama list | grep -q "codellama"; then
    print_status "CodeLlama model already available"
else
    ollama pull codellama:13b-instruct
    print_status "CodeLlama 13B model pulled successfully"
fi

# Step 4: Install additional development tools
print_step "Installing additional development tools..."

# Install kubectl
if ! command -v kubectl &> /dev/null; then
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    rm kubectl
    print_status "kubectl installed"
fi

# Install helm
if ! command -v helm &> /dev/null; then
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
    print_status "Helm installed"
fi

# Install devcontainer CLI (if not already present)
if ! command -v devcontainer &> /dev/null; then
    curl -fsSL https://github.com/devcontainers/cli/releases/latest/download/devcontainer-linux-amd64 -o /usr/local/bin/devcontainer
    chmod +x /usr/local/bin/devcontainer
    print_status "DevContainer CLI installed"
fi

# Step 5: Setup workspace environment
print_step "Setting up workspace environment..."

# Create workspace directories
mkdir -p /workspace/projects
mkdir -p /workspace/data
mkdir -p /workspace/models

# Set environment variables
echo "export OLLAMA_HOST=http://localhost:11434" >> ~/.bashrc
echo "export WORKSPACE_DIR=/workspace" >> ~/.bashrc
echo "export ULTRA_DEVBOX=true" >> ~/.bashrc

# Create helpful aliases
echo "alias ll='ls -la'" >> ~/.bashrc
echo "alias dev='cd /workspace/projects'" >> ~/.bashrc
echo "alias models='cd /workspace/models'" >> ~/.bashrc

# Step 6: Install VS Code Server
print_step "Installing VS Code Server..."
if ! command -v code-server &> /dev/null; then
    curl -fsSL https://code-server.dev/install.sh | sh -s -- --method=standalone --prefix=/tmp/code-server
    mkdir -p ~/.local/bin
    ln -sf /tmp/code-server/bin/code-server ~/.local/bin/code-server
    print_status "VS Code Server installed"
fi

# Step 7: Create welcome message
print_step "Creating welcome configuration..."

cat > ~/.welcome << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║                    🚀 Ultra DevBox Ready!                    ║
╠══════════════════════════════════════════════════════════════╣
║  Your development environment is now fully configured!       ║
║                                                              ║
║  🐳 Docker-in-Docker:     Available                          ║
║  🤖 AI Assistant (Ollama): http://localhost:11434            ║
║  💻 VS Code Server:       http://localhost:8080              ║
║  📁 Workspace:            /workspace                         ║
║                                                              ║
║  Quick Start Commands:                                       ║
║  • dev          - Navigate to projects directory            ║
║  • models       - Navigate to models directory              ║
║  • ollama list  - List available AI models                  ║
║  • docker ps    - List running containers                   ║
║                                                              ║
║  AI Model Usage:                                             ║
║  • ollama run codellama:13b-instruct                        ║
║  • Install Continue extension in VS Code for AI assistance   ║
║                                                              ║
║  Happy coding! 🎉                                           ║
╚══════════════════════════════════════════════════════════════╝
EOF

# Step 8: Create startup script
cat > /workspace/start.sh << 'EOF'
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

# Display welcome message
cat ~/.welcome
EOF

chmod +x /workspace/start.sh

# Step 9: Create sample project
print_step "Creating sample project..."
mkdir -p /workspace/projects/hello-ultra-devbox

cat > /workspace/projects/hello-ultra-devbox/package.json << 'EOF'
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
EOF

cat > /workspace/projects/hello-ultra-devbox/index.js << 'EOF'
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
EOF

cat > /workspace/projects/hello-ultra-devbox/README.md << 'EOF'
# Hello Ultra DevBox

This is a sample project to demonstrate Ultra DevBox capabilities.

## Quick Start

```bash
npm install
npm start
```

Then visit http://localhost:3000 to see your app running!

## Ultra DevBox Features

- 🐳 **Docker-in-Docker**: Build and run containers
- 🤖 **AI Assistant**: Use CodeLlama for intelligent coding
- 💻 **VS Code**: Full IDE experience in browser
- 🚀 **Multi-service**: Run complex applications

## AI Integration

Try the AI assistant:

```bash
ollama run codellama:13b-instruct
```

Ask it to help you improve this code!
EOF

# Final setup
print_step "Finalizing setup..."

# Kill background ollama process
kill $OLLAMA_PID 2>/dev/null || true

# Success message
echo ""
print_status "🎉 Ultra DevBox setup completed successfully!"
echo ""
cat ~/.welcome
echo ""

print_status "📝 Next Steps:"
echo "   1. Run '/workspace/start.sh' to start all services"
echo "   2. Open http://localhost:8080 for VS Code"
echo "   3. Open http://localhost:11434 for Ollama"
echo "   4. Check /workspace/projects/hello-ultra-devbox for sample project"
echo ""

print_status "💡 Pro Tip: Add the 'Continue' extension to VS Code for AI assistance!"
echo ""