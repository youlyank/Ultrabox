'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Monitor, Server, Container, Cpu, Database, Globe, Shield, ArrowRight, Github, Terminal, Code } from 'lucide-react'

export default function ArchitectureDiagram() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  const layers = [
    {
      id: 'browser',
      name: 'Browser Layer',
      icon: Monitor,
      color: 'bg-blue-500',
      description: 'Web-based IDE with Monaco editor and terminal',
      components: ['Monaco Editor', 'xterm.js', 'WebSocket Client'],
      details: 'Full VS Code experience in the browser with real-time collaboration'
    },
    {
      id: 'workspace',
      name: 'Workspace Pod',
      icon: Container,
      color: 'bg-orange-500',
      description: 'Per-user Docker-enabled development environment',
      components: ['Ubuntu 22.04', 'Docker-in-Docker', 'Ollama + CodeLlama', 'VS Code Server'],
      details: 'Isolated container with rootless Docker and local LLM inference'
    },
    {
      id: 'control',
      name: 'Control Plane',
      icon: Server,
      color: 'bg-green-500',
      description: 'Orchestration and management layer',
      components: ['Coder/DevPod', 'Traefik Ingress', 'OAuth2 Proxy', 'GitHub SSO'],
      details: 'Template management, user authentication, and load balancing'
    }
  ]

  const connections = [
    { from: 'browser', to: 'workspace', label: 'WebSocket' },
    { from: 'workspace', to: 'control', label: 'K8s/Docker' }
  ]

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-6 w-6 text-orange-600" />
            High-Level Architecture
          </CardTitle>
          <CardDescription>
            Interactive visualization of the Ultra DevBox stack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Architecture Diagram */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-8">
              {layers.map((layer, index) => (
                <div key={layer.id} className="relative">
                  <div
                    className={`relative cursor-pointer transition-all duration-300 ${
                      selectedLayer === layer.id ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                  >
                    <div className={`w-48 h-48 ${layer.color} rounded-xl flex flex-col items-center justify-center text-white p-6 shadow-lg`}>
                      <layer.icon className="h-12 w-12 mb-3" />
                      <h3 className="font-bold text-lg text-center">{layer.name}</h3>
                    </div>
                    
                    {/* Connection arrows */}
                    {index < layers.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                        <ArrowRight className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile connection */}
                  {index < layers.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowRight className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Connection Labels */}
            <div className="flex flex-col lg:flex-row justify-center gap-16 lg:gap-32 mt-4">
              <Badge variant="secondary" className="text-xs">WebSocket</Badge>
              <Badge variant="secondary" className="text-xs">K8s/Docker</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layer Details */}
      {selectedLayer && (
        <Card className="animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {layers.find(l => l.id === selectedLayer)?.icon && 
                React.createElement(layers.find(l => l.id === selectedLayer)!.icon, { className: "h-6 w-6 text-orange-600" })
              }
              {layers.find(l => l.id === selectedLayer)?.name}
            </CardTitle>
            <CardDescription>
              {layers.find(l => l.id === selectedLayer)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Key Components:</h4>
              <div className="flex flex-wrap gap-2">
                {layers.find(l => l.id === selectedLayer)?.components.map((component) => (
                  <Badge key={component} variant="outline">{component}</Badge>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {layers.find(l => l.id === selectedLayer)?.details}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Technical Specifications */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-orange-600" />
              Workspace Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Base OS:</span>
              <span>Ubuntu 22.04 (rootless)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Docker:</span>
              <span>Docker-in-Docker enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">LLM Engine:</span>
              <span>Ollama + CodeLlama 13B</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">IDE Port:</span>
              <span>8080 (VS Code Server)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">App Ports:</span>
              <span>3000+ (dynamic mapping)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Security & Isolation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Container Isolation:</span>
              <span>Per-user namespaces</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Authentication:</span>
              <span>GitHub OAuth + SSO</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Network:</span>
              <span>Traefik + HTTPS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Optional Hardening:</span>
              <span>Kata Containers/gVisor</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Data Control:</span>
              <span>Self-hosted only</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-orange-600" />
            Request Flow
          </CardTitle>
          <CardDescription>
            How a developer interacts with the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 1, title: 'User Access', description: 'Developer logs in via GitHub SSO', icon: Github },
              { step: 2, title: 'Repo Selection', description: 'Choose any GitHub repository to clone', icon: Code },
              { step: 3, title: 'Workspace Creation', description: 'Docker container spins up with dev tools', icon: Container },
              { step: 4, title: 'IDE Launch', description: 'VS Code Server opens in browser', icon: Terminal },
              { step: 5, title: 'Development', description: 'Code, build, and test with Docker support', icon: Cpu },
              { step: 6, title: 'AI Assistance', description: 'Local LLM provides code completion', icon: Database }
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">{item.step}</span>
                </div>
                <item.icon className="h-5 w-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}