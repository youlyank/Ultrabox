'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Play, Check, Terminal, Code, FileText, Globe, Shield, Zap } from 'lucide-react'

export default function SetupDemo() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCommand(id)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const setupCommands = [
    {
      id: 'clone',
      title: 'Clone Repository',
      command: 'git clone https://github.com/your-org/ultra-devbox\ncd ultra-devbox',
      description: 'Get the latest Ultra DevBox source code'
    },
    {
      id: 'env',
      title: 'Configure Environment',
      command: 'cp .env.example .env\n# Edit .env with your settings',
      description: 'Set up GitHub token, repo URL, and LLM model'
    },
    {
      id: 'launch',
      title: 'Launch Platform',
      command: 'docker compose up --build',
      description: 'Build and start all services'
    }
  ]

  const dockerfile = `FROM ubuntu:22.04

# 1. Base tools
RUN apt-get update && \\
    apt-get install -y curl git build-essential zsh && \\
    rm -rf /var/lib/apt/lists/*

# 2. Docker-in-Docker (rootless)
RUN curl -fsSL https://get.docker.com | sh && \\
    useradd -m -s /bin/zsh coder && \\
    usermod -aG docker coder

# 3. Dev Containers CLI
RUN curl -fsSL https://github.com/devcontainers/cli/releases/latest/download/devcontainer-linux-amd64 \\
    -o /usr/local/bin/devcontainer && chmod +x /usr/local/bin/devcontainer

# 4. Ollama + LLM
RUN curl -fsSL https://ollama.ai/install.sh | sh
USER coder
RUN ollama pull codellama:13b-instruct

# 5. VS Code server
COPY --from=gitpod/openvscode-server:latest /openvscode-server /opt/openvscode-server
ENV PATH="/opt/openvscode-server/bin:$PATH"

WORKDIR /workspace
CMD ["openvscode-server", "--host", "0.0.0.0", "--port", "8080"]`

  const dockerCompose = `version: "3.9"
services:
  workspace:
    build: .
    privileged: false
    user: "coder"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock   # Docker-in-Docker
      - workspace_data:/workspace
    ports:
      - "8080:8080"   # VS Code
    environment:
      - GIT_REPO=https://github.com/user/repo.git
      - GIT_TOKEN=\${GITHUB_TOKEN}
      - OLLAMA_MODEL=codellama:13b-instruct
    command: >
      sh -c "
        git clone --depth 1 \$${GIT_REPO} /workspace || true &&
        ollama serve & sleep 3 &&
        openvscode-server --host 0.0.0.0 --port 8080 --without-connection-token
      "

  traefik:
    image: traefik:v3.0
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
    ports:
      - "80:80"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  workspace_data:`

  const envExample = `# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
DEFAULT_REPO=https://github.com/example/starter-project

# LLM Configuration
OLLAMA_MODEL=codellama:13b-instruct
OLLAMA_BASE_URL=http://localhost:11434

# Platform Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
DOMAIN=localhost
HTTPS_ENABLED=false

# Optional: Scaling Configuration
MAX_WORKSPACES_PER_USER=5
WORKSPACE_TIMEOUT=24h
DOCKER_NETWORK=ultra-devbox-network`

  return (
    <div className="space-y-8">
      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-600" />
            One-Command Setup
          </CardTitle>
          <CardDescription>
            Get Ultra DevBox running in under 60 seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {setupCommands.map((step) => (
              <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">
                    {setupCommands.indexOf(step) + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-slate-600">{step.description}</p>
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{step.command}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(step.command, step.id)}
                    >
                      {copiedCommand === step.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <Globe className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Launch!</h3>
              <p className="text-slate-600 mb-4">
                Open https://localhost in your browser and login with admin/admin
              </p>
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600">
                <Play className="mr-2 h-5 w-5" />
                Launch Ultra DevBox
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600" />
            Configuration Files
          </CardTitle>
          <CardDescription>
            Complete setup files for customization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dockerfile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dockerfile">Dockerfile</TabsTrigger>
              <TabsTrigger value="compose">docker-compose.yml</TabsTrigger>
              <TabsTrigger value="env">.env.example</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dockerfile" className="mt-4">
              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                  <code>{dockerfile}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(dockerfile, 'dockerfile')}
                >
                  {copiedCommand === 'dockerfile' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                <Badge variant="outline">Ubuntu 22.04</Badge>
                <Badge variant="outline">Docker-in-Docker</Badge>
                <Badge variant="outline">Ollama</Badge>
                <Badge variant="outline">VS Code Server</Badge>
              </div>
            </TabsContent>
            
            <TabsContent value="compose" className="mt-4">
              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                  <code>{dockerCompose}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(dockerCompose, 'compose')}
                >
                  {copiedCommand === 'compose' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                <Badge variant="outline">Traefik</Badge>
                <Badge variant="outline">Docker Socket</Badge>
                <Badge variant="outline">Volume Persistence</Badge>
              </div>
            </TabsContent>
            
            <TabsContent value="env" className="mt-4">
              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                  <code>{envExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(envExample, 'env')}
                >
                  {copiedCommand === 'env' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                <Badge variant="outline">GitHub Integration</Badge>
                <Badge variant="outline">LLM Settings</Badge>
                <Badge variant="outline">Security Config</Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-600" />
            Verification & Testing
          </CardTitle>
          <CardDescription>
            Ensure everything is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">System Checks</h4>
              <div className="space-y-3">
                {[
                  { check: 'Docker Engine', command: 'docker --version' },
                  { check: 'Docker Compose', command: 'docker compose version' },
                  { check: 'Port Availability', command: 'netstat -tulpn | grep :80' },
                  { check: 'Memory Usage', command: 'free -h' }
                ].map((item) => (
                  <div key={item.check} className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm font-medium">{item.check}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.command}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Service Health</h4>
              <div className="space-y-3">
                {[
                  { service: 'VS Code Server', port: 8080, status: 'healthy' },
                  { service: 'Traefik Proxy', port: 80, status: 'healthy' },
                  { service: 'Ollama LLM', port: 11434, status: 'healthy' },
                  { service: 'Workspace Container', port: 'dynamic', status: 'healthy' }
                ].map((item) => (
                  <div key={item.service} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-medium">{item.service}</p>
                      <p className="text-xs text-slate-600">Port: {item.port}</p>
                    </div>
                    <Badge variant={item.status === 'healthy' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-orange-600" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                issue: 'Docker socket permission denied',
                solution: 'Add user to docker group: sudo usermod -aG docker $USER',
                command: 'sudo usermod -aG docker $USER'
              },
              {
                issue: 'Port 80 already in use',
                solution: 'Stop conflicting services or change Traefik port',
                command: 'sudo lsof -i :80'
              },
              {
                issue: 'Ollama model download fails',
                solution: 'Check internet connection and try manual pull',
                command: 'docker exec workspace ollama pull codellama:13b-instruct'
              },
              {
                issue: 'Workspace won\'t start',
                solution: 'Check logs and ensure Docker daemon is running',
                command: 'docker compose logs workspace'
              }
            ].map((trouble) => (
              <div key={trouble.issue} className="p-4 border rounded-lg">
                <h5 className="font-semibold text-red-600 mb-2">{trouble.issue}</h5>
                <p className="text-sm text-slate-600 mb-2">{trouble.solution}</p>
                <div className="relative">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
                    <code>{trouble.command}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-1 right-1"
                    onClick={() => copyToClipboard(trouble.command, trouble.issue)}
                  >
                    {copiedCommand === trouble.issue ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}