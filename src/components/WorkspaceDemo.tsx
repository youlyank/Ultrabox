'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Terminal, 
  Code, 
  Play, 
  Copy, 
  Check, 
  Zap, 
  Container, 
  GitBranch,
  Settings,
  FileText,
  Globe,
  Monitor,
  Cpu,
  Database
} from 'lucide-react'

export default function WorkspaceDemo() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeDemo, setActiveDemo] = useState('ide')

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sampleCode = `// Ultra DevBox - AI-Powered Development
import React, { useState, useEffect } from 'react';

function UltraDevBoxDemo() {
  const [workspace, setWorkspace] = useState(null);
  const [dockerStatus, setDockerStatus] = useState('checking');

  useEffect(() => {
    // Initialize workspace with Docker support
    initializeWorkspace();
  }, []);

  const initializeWorkspace = async () => {
    try {
      // Clone repository
      await exec('git clone https://github.com/user/project.git');
      
      // Start Docker services
      await exec('docker compose up -d');
      
      // Pull LLM model
      await exec('ollama pull codellama:13b-instruct');
      
      setDockerStatus('ready');
    } catch (error) {
      console.error('Workspace initialization failed:', error);
    }
  };

  return (
    <div className="workspace-container">
      <h1>Welcome to Ultra DevBox!</h1>
      <p>Docker: {dockerStatus}</p>
      <p>AI Assistant: Ready</p>
    </div>
  );
}

export default UltraDevBoxDemo;`

  const dockerComposeDemo = `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ultradevbox
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: dev123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`

  const terminalCommands = [
    { command: 'docker ps', description: 'List running containers' },
    { command: 'docker compose logs -f', description: 'View service logs' },
    { command: 'ollama list', description: 'Check available LLM models' },
    { command: 'git status', description: 'Check repository status' },
    { command: 'npm run dev', description: 'Start development server' },
    { command: 'curl localhost:3000', description: 'Test application endpoint' }
  ]

  const workspaceFeatures = [
    { icon: Container, title: 'Docker Support', description: 'Full Docker CLI and compose support' },
    { icon: Zap, title: 'AI Assistant', description: 'CodeLlama for intelligent coding' },
    { icon: Terminal, title: 'Terminal Access', description: 'Full shell with all tools' },
    { icon: GitBranch, title: 'Git Integration', description: 'Seamless GitHub workflow' },
    { icon: Monitor, title: 'VS Code Server', description: 'Full IDE experience in browser' },
    { icon: Globe, title: 'Port Forwarding', description: 'Access your apps on custom ports' }
  ]

  return (
    <div className="space-y-8">
      {/* Interactive Demo Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-6 w-6 text-orange-600" />
            Interactive Workspace Demo
          </CardTitle>
          <CardDescription>
            Experience the power of Ultra DevBox with real examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {workspaceFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <feature.icon className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeDemo} onValueChange={setActiveDemo}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ide" className="text-xs">VS Code IDE</TabsTrigger>
              <TabsTrigger value="terminal" className="text-xs">Terminal</TabsTrigger>
              <TabsTrigger value="docker" className="text-xs">Docker</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">AI Assistant</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDemo} onValueChange={setActiveDemo}>
            <TabsContent value="ide" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">VS Code Server Interface</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Docker</Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-2 text-sm">workspace/src/App.tsx</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(sampleCode, 'sample-code')}
                    >
                      {copiedCode === 'sample-code' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                    <code>{sampleCode}</code>
                  </pre>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">File Explorer</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-600" />
                          <span>src/</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span>App.tsx</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-600" />
                            <span>index.tsx</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-600" />
                          <span>package.json</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-600" />
                          <span>docker-compose.yml</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Extensions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Continue</span>
                          <Badge variant="secondary">AI Assistant</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Docker</span>
                          <Badge variant="secondary">Container Tools</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>GitLens</span>
                          <Badge variant="secondary">Git Enhanced</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>ESLint</span>
                          <Badge variant="secondary">Code Quality</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="terminal" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Terminal with xterm.js</h4>
                  <Badge variant="outline">zsh</Badge>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-black text-green-400 p-4 font-mono text-sm">
                    <div className="mb-2">
                      <span className="text-yellow-400">coder@ultra-devbox</span>:<span className="text-blue-400">~/workspace</span>$ git status
                    </div>
                    <div className="mb-2">On branch main</div>
                    <div className="mb-2">Your branch is up to date with 'origin/main'.</div>
                    <div className="mb-2">nothing to commit, working tree clean</div>
                    <div className="mb-2">
                      <span className="text-yellow-400">coder@ultra-devbox</span>:<span className="text-blue-400">~/workspace</span>$ docker ps
                    </div>
                    <div className="mb-2">CONTAINER ID   IMAGE          COMMAND   CREATED   STATUS    PORTS     NAMES</div>
                    <div className="mb-2">
                      <span className="text-yellow-400">coder@ultra-devbox</span>:<span className="text-blue-400">~/workspace</span>$ ollama list
                    </div>
                    <div className="mb-2">NAME              ID           SIZE   MODIFIED</div>
                    <div className="mb-2">codellama:13b    abc123       7.4GB  2 hours ago</div>
                    <div className="mb-4">
                      <span className="text-yellow-400">coder@ultra-devbox</span>:<span className="text-blue-400">~/workspace</span>$ <span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {terminalCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs font-mono justify-start"
                      onClick={() => copyToClipboard(cmd.command, `cmd-${index}`)}
                    >
                      {copiedCode === `cmd-${index}` ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Terminal className="h-3 w-3 mr-1" />
                      )}
                      {cmd.command}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="docker" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Docker-in-Docker Support</h4>
                  <Badge variant="outline">Multi-Service</Badge>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm">docker-compose.yml</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(dockerComposeDemo, 'docker-compose')}
                    >
                      {copiedCode === 'docker-compose' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                    <code>{dockerComposeDemo}</code>
                  </pre>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Container className="h-4 w-4" />
                        Running Containers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>web</span>
                          <Badge variant="default">Running</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>redis</span>
                          <Badge variant="default">Running</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>postgres</span>
                          <Badge variant="default">Running</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Port Mappings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Web App</span>
                          <Badge variant="outline">localhost:3000</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Redis</span>
                          <Badge variant="outline">localhost:6379</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>PostgreSQL</span>
                          <Badge variant="outline">localhost:5432</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>VS Code</span>
                          <Badge variant="outline">localhost:8080</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">AI Assistant Integration</h4>
                  <Badge variant="outline">CodeLlama 13B</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Code Completion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                          <div className="text-slate-600">{`// Type 'function' to see AI suggestions`}</div>
                          <div>function calculateTotal(items) {`{`}</div>
                          <div className="text-blue-600">{`  // AI suggests: return items.reduce((sum, item) => sum + item.price, 0);`}</div>
                          <div>{`}`}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        Model Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Model</span>
                          <Badge variant="outline">CodeLlama-13B</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <Badge variant="default">Ready</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Context</span>
                          <span>4096 tokens</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Memory</span>
                          <span>8.2 GB</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">AI Chat Interface</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">You:</p>
                        <p className="text-sm">How do I optimize this React component for performance?</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">AI Assistant:</p>
                        <p className="text-sm">Here are some optimization strategies for your React component:</p>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Use React.memo() to prevent unnecessary re-renders</li>
                          <li>• Implement useMemo() for expensive calculations</li>
                          <li>• Use useCallback() for function props</li>
                          <li>• Consider virtualization for large lists</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Live Demo Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Try It Yourself</CardTitle>
          <CardDescription>
            Start your own Ultra DevBox workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600">
              <Play className="mr-2 h-5 w-5" />
              Launch Workspace
            </Button>
            <Button size="lg" variant="outline">
              <GitBranch className="mr-2 h-5 w-5" />
              Clone Demo Repository
            </Button>
            <Button size="lg" variant="outline">
              <Settings className="mr-2 h-5 w-5" />
              Customize Environment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}