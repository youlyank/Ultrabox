# 🚀 Ultra DevBox - The Replit + Bolt Killer

[![Open in Dev Containers](https://img.shields.io/badge/Dev_Container-Open-blue?logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/ultra-devbox/ultra-devbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![AI](https://img.shields.io/badge/AI-Powered-orange?logo=ollama)](https://ollama.ai/)

> **Ultra DevBox** stitches together **only open-source projects** to create a **Replit + Bolt killer** that spins up **per-user Docker-enabled dev environments** with real **Docker-in-Docker**, **open-source LLM stack**, and **flexible deployment options**.

## ✨ Key Features

- 🐳 **Real Docker-in-Docker** - Build/push images, run docker compose, multi-service apps
- 🤖 **Open-Source LLM Stack** - CodeLlama/StarCoder with local inference (no vendor lock-in)
- 💻 **Full VS Code Experience** - Complete IDE in browser with extensions
- 🔄 **Two Deployment Modes** - In-browser (Bolt-style) or server-side (Replit-style)
- 🏗️ **Template Marketplace** - Community-driven templates with 80% revenue share
- 💰 **Billing Integration** - Stripe-powered tiers with resource management
- 🔒 **Self-Hosted** - Full data control, GitHub SSO, enterprise security

## 🚀 One-Command Setup

```bash
git clone https://github.com/ultra-devbox/ultra-devbox
cd ultra-devbox
cp .env.example .env
docker compose up --build
```

Open `https://localhost` → login with `admin/admin` → paste any GitHub repo → workspace boots with Docker + LLM ready.

## 📁 Repository Structure

```
ultra-devbox/
├── .devcontainer/           # GitHub Codespaces + Dev Containers config
│   ├── devcontainer.json   # Docker-in-Docker + Ollama setup
│   └── post-create.sh      # Automated workspace initialization
├── workspace/              # Production workspace Dockerfile
│   └── Dockerfile          # Complete dev environment
├── platform/               # Coder templates + billing + marketplace
│   ├── coder/              # Terraform templates for Coder
│   ├── helm/               # Kubernetes charts
│   ├── billing/            # Stripe microservice
│   └── marketplace/        # Template registry
├── web/                    # Next.js landing page + demo
│   └── src/                # React components
├── bolt/                   # StackBlitz WebContainers fallback
└── README.md               # This file
```

## 🎯 Quick Start Options

### Option 1: GitHub Codespaces (Recommended)
1. Click **"Use this template"** → **"Open in Codespaces"**
2. Wait 60 seconds for automatic setup
3. VS Code opens with Docker + Ollama ready
4. Start coding immediately!

### Option 2: Local Dev Container
```bash
# Clone and open in VS Code
git clone https://github.com/ultra-devbox/ultra-devbox
cd ultra-devbox
code .

# VS Code will prompt to reopen in Dev Container
# Click "Reopen in Container" and wait for setup
```

### Option 3: Docker Compose
```bash
git clone https://github.com/ultra-devbox/ultra-devbox
cd ultra-devbox
cp .env.example .env  # Edit with your settings
docker compose up --build
```

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────────────────┐
│  Browser    │──────►  Web IDE (VS Code)       │
│  (Monaco)   │      + xterm.js + AI Assistant │
└─────────────┘      └────────┬─────────────────┘
                              │ WebSocket
                              │
┌─────────────────────────────┴─────────────────────┐
│  Workspace Pod / Container (per user)             │
│  • Ubuntu 22.04 rootless                          │
│  • Docker-in-Docker (dind)                        │
│  • Ollama + CodeLlama 13B                         │
│  • VS Code Server (port 8080)                     │
│  • Auto-cloned GitHub repo                        │
└───────────────────────────────────────────────────┘
                              │
                              │ K8s / Docker-Compose
                              │
┌─────────────────────────────┴─────────────────────┐
│  Control plane (optional)                         │
│  • Coder templates + quotas                        │
│  • Traefik ingress + OAuth2                        │
│  • Stripe billing + usage tracking                 │
└───────────────────────────────────────────────────┘
```

## 💻 Development Environments

### Ultra DevBox (Full Stack)
- ✅ Real Docker-in-Docker
- ✅ Multi-service applications
- ✅ AI-powered development
- ✅ Complete development stack
- ✅ Self-hosted option

### Bolt Environment (Browser-only)
- ✅ Instant setup (seconds)
- ✅ No infrastructure required
- ✅ Perfect for JS/TS projects
- ❌ No Docker support
- ❌ Limited to single projects

Access both at:
- **Ultra DevBox**: `https://localhost:8080`
- **Bolt Environment**: `https://localhost/bolt?repo=<url>`

## 🤖 AI Integration

### Local LLM Models
```bash
# Check available models
ollama list

# Use AI assistant
ollama run codellama:13b-instruct

# Pull additional models
ollama pull starcoder:15b
ollama pull wizardcoder:15b
```

### VS Code Integration
1. Install **Continue** extension
2. Point to `http://localhost:11434`
3. Features: autocomplete, inline chat, repo-wide refactor

## 💰 Billing & Tiers

| Tier | Price | CPU | Memory | Storage | GPU | Features |
|------|-------|-----|---------|---------|-----|----------|
| **Free** | $0 | 2 | 4GB | 20GB | ❌ | 1 workspace, community support |
| **Starter** | $29/mo | 4 | 8GB | 50GB | ❌ | 5 workspaces, AI assistant |
| **Pro** | $99/mo | 8 | 16GB | 100GB | ✅ | Unlimited, GPU support |
| **Enterprise** | $299/mo | 16 | 32GB | 500GB | ✅ | Advanced security, SLA |

## 📦 Template Marketplace

### Using Templates
```bash
# Browse templates at https://localhost/marketplace
# Click "Use Template" to create workspace
# Or use CLI:
ultra-devbox create --template react-starter
```

### Creating Templates
```bash
# Create your own template
mkdir my-template
cd my-template
# Add .devcontainer/devcontainer.json
# Publish to marketplace
ultra-devbox publish --price=999 --revenue-share=80
```

### Featured Templates
- **React + TypeScript** - Modern React with Tailwind CSS
- **Python ML** - Jupyter + TensorFlow + PyTorch
- **Node.js Microservices** - Docker + Kubernetes + Istio
- **Go API** - Gin + GORM + PostgreSQL + Redis

## 🔧 Configuration

### Environment Variables
```bash
# GitHub Integration
GITHUB_TOKEN=your_github_token
DEFAULT_REPO=https://github.com/example/starter

# LLM Configuration
OLLAMA_MODEL=codellama:13b-instruct
OLLAMA_BASE_URL=http://localhost:11434

# Platform Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
DOMAIN=localhost
HTTPS_ENABLED=false

# Billing (Stripe)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ultradevbox
REDIS_URL=redis://localhost:6379
```

### Resource Limits
```yaml
# Set per-user quotas
limits:
  max_workspaces: 5
  max_cpu: 8
  max_memory: 16Gi
  max_disk: 100Gi
  max_gpu: 2
```

## 🚀 Deployment

### Single Node (Docker Compose)
```bash
docker compose up --build
```

### Multi-Node (Kubernetes)
```bash
# Install Helm chart
helm repo add ultra-devbox https://charts.ultra-devbox.com
helm install ultra-devbox ultra-devbox/ultra-devbox

# Configure values
helm upgrade ultra-devbox ultra-devbox/ultra-devbox -f values.yaml
```

### Cloud Deployment
- **AWS**: EKS + RDS + ElastiCache
- **GCP**: GKE + Cloud SQL + Memorystore
- **Azure**: AKS + Azure Database + Redis Cache

## 🔒 Security

### Authentication
- **GitHub OAuth** - Primary authentication method
- **SSO** - SAML, OIDC support (Enterprise)
- **API Keys** - For programmatic access

### Isolation
- **Rootless Containers** - User namespaces
- **Network Policies** - Kubernetes network isolation
- **Resource Quotas** - CPU/memory limits
- **Optional Hardening** - Kata Containers, gVisor

### Data Protection
- **Encryption at Rest** - Database and storage encryption
- **Encryption in Transit** - TLS everywhere
- **Data Control** - Self-hosted option available

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Contributing
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests
5. Submit pull request

### Code Style
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits for changelog

## 📚 API Documentation

### REST API
```bash
# Health check
GET /health

# User billing info
GET /api/billing/me

# Create checkout session
POST /api/billing/checkout

# Usage statistics
GET /api/billing/usage

# Template marketplace
GET /api/marketplace/templates
```

### WebSocket API
```javascript
// Real-time workspace events
const ws = new WebSocket('ws://localhost:3000/api/socketio')
ws.on('connect', () => {
  console.log('Connected to Ultra DevBox')
})
```

## 🆘 Troubleshooting

### Common Issues

**Docker socket permission denied**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**Port 80 already in use**
```bash
sudo lsof -i :80
# Stop conflicting service or change port
```

**Ollama model download fails**
```bash
# Check internet connection
curl -I https://ollama.ai
# Manual pull
docker exec workspace ollama pull codellama:13b-instruct
```

**Workspace won't start**
```bash
# Check logs
docker compose logs workspace
# Ensure Docker daemon is running
sudo systemctl status docker
```

### Getting Help
- 📖 [Documentation](https://docs.ultra-devbox.com)
- 💬 [Discord Community](https://discord.gg/ultra-devbox)
- 🐛 [GitHub Issues](https://github.com/ultra-devbox/ultra-devbox/issues)
- 📧 [Support](mailto:support@ultra-devbox.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Coder** - Open-source remote development platform
- **Ollama** - Local LLM inference
- **VS Code** - Web-based IDE
- **Docker** - Containerization platform
- **StackBlitz** - WebContainers technology

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ultra-devbox/ultra-devbox&type=Date)](https://star-history.com/#ultra-devbox/ultra-devbox&Date)

---

<div align="center">
  <p>Made with ❤️ by the Ultra DevBox Team</p>
  <p>
    <a href="#top">Back to top</a>
  </p>
</div>