'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Container, 
  Zap, 
  Terminal, 
  Code, 
  GitBranch, 
  Shield, 
  Rocket, 
  Users, 
  Cpu,
  Database,
  Globe,
  Lock,
  Play,
  Check,
  X,
  ArrowRight
} from 'lucide-react'

export default function FeaturesShowcase() {
  const [activeFeature, setActiveFeature] = useState('docker')

  const features = {
    docker: {
      title: 'Real Docker-in-Docker',
      icon: Container,
      color: 'bg-blue-500',
      description: 'Unlike competitors, we provide true containerization capabilities',
      capabilities: [
        'Build and push Docker images',
        'Run docker compose with networking',
        'Multi-service application development',
        'Container orchestration',
        'Volume mounting and persistence'
      ],
      limitations: [
        'No real Docker (Replit/Bolt)',
        'Cannot build images',
        'Single app only',
        'No compose support'
      ]
    },
    llm: {
      title: 'Open-Source LLM Stack',
      icon: Zap,
      color: 'bg-orange-500',
      description: 'Local AI inference with no vendor lock-in',
      capabilities: [
        'CodeLlama 13B for code completion',
        'StarCoder 15B for specialized tasks',
        'WizardCoder for advanced refactoring',
        'Local processing (no data leaves)',
        'Custom model support'
      ],
      limitations: [
        'Proprietary AI only',
        'Usage limits and quotas',
        'Data sent to third parties',
        'No custom models'
      ]
    },
    ide: {
      title: 'Full VS Code Experience',
      icon: Terminal,
      color: 'bg-green-500',
      description: 'Complete development environment in your browser',
      capabilities: [
        'Full VS Code Server integration',
        'Extensions marketplace support',
        'Integrated terminal with xterm.js',
        'Debugging and profiling',
        'Git integration and source control'
      ],
      limitations: [
        'Limited editor functionality',
        'No extensions support',
        'Basic terminal only',
        'No debugging tools'
      ]
    },
    deployment: {
      title: 'Flexible Deployment',
      icon: Rocket,
      color: 'bg-purple-500',
      description: 'Deploy anywhere with full control',
      capabilities: [
        'Single-node Docker Compose',
        'Multi-user Kubernetes scaling',
        'On-premises deployment',
        'Cloud provider agnostic',
        'Custom templates and quotas'
      ],
      limitations: [
        'Cloud-only deployment',
        'No on-premises option',
        'Vendor lock-in',
        'Limited scaling options'
      ]
    }
  }

  return (
    <div className="space-y-8">
      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-600" />
            Competitive Advantages
          </CardTitle>
          <CardDescription>
            See how Ultra DevBox compares to Replit and Bolt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFeature} onValueChange={setActiveFeature}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="docker" className="text-xs">Docker Support</TabsTrigger>
              <TabsTrigger value="llm" className="text-xs">AI/LLM</TabsTrigger>
              <TabsTrigger value="ide" className="text-xs">IDE Features</TabsTrigger>
              <TabsTrigger value="deployment" className="text-xs">Deployment</TabsTrigger>
            </TabsList>
            
            {Object.entries(features).map(([key, feature]) => (
              <TabsContent key={key} value={key} className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Ultra DevBox Capabilities
                      </h4>
                      {feature.capabilities.map((capability) => (
                        <div key={capability} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                        <X className="h-4 w-4" />
                        Replit/Bolt Limitations
                      </h4>
                      {feature.limitations.map((limitation) => (
                        <div key={limitation} className="flex items-start gap-2 text-sm mb-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Container className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Multi-Service Apps</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Build complex applications with multiple containers, databases, and services using real Docker networking.
            </p>
            <div className="space-y-2">
              <Badge variant="secondary">docker compose</Badge>
              <Badge variant="secondary">service discovery</Badge>
              <Badge variant="secondary">load balancing</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg">AI Code Assistant</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Local CodeLlama and StarCoder models provide intelligent code completion, refactoring, and explanations.
            </p>
            <div className="space-y-2">
              <Badge variant="secondary">CodeLlama 13B</Badge>
              <Badge variant="secondary">StarCoder 15B</Badge>
              <Badge variant="secondary">offline processing</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Terminal className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Full Terminal Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Complete shell access with xterm.js, supporting all Linux commands and Docker operations.
            </p>
            <div className="space-y-2">
              <Badge variant="secondary">zsh/bash</Badge>
              <Badge variant="secondary">docker cli</Badge>
              <Badge variant="secondary">git</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">GitHub Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Clone any repository with one click, commit changes, and push back to GitHub seamlessly.
            </p>
            <div className="space-y-2">
              <Badge variant="secondary">auto-clone</Badge>
              <Badge variant="secondary">ssh keys</Badge>
              <Badge variant="secondary">PR creation</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle className="text-lg">Enterprise Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Self-hosted with full data control, SSO integration, and container isolation.
            </p>
            <div className="space-y-2">
              <Badge variant="secondary">GitHub SSO</Badge>
              <Badge variant="secondary">OAuth2</Badge>
              <Badge variant="secondary">data privacy</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-cyan-600" />
              </div>
              <CardTitle className="text-lg">Team Collaboration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Share workspaces, collaborate in real-time, and maintain consistent environments.
            </p>
            <div className="space-y-2">
              <Badge variant="secondary">real-time sync</Badge>
              <Badge variant="secondary">team templates</Badge>
              <Badge variant="secondary">access control</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Deep Dive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-orange-600" />
            Technical Deep Dive
          </CardTitle>
          <CardDescription>
            Advanced features for power users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Container Runtime</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Container Engine:</span>
                  <Badge variant="outline">Docker Engine</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Runtime Mode:</span>
                  <Badge variant="outline">Rootless</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Storage Driver:</span>
                  <Badge variant="outline">overlay2</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Network Plugin:</span>
                  <Badge variant="outline">bridge + host</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">LLM Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Inference Engine:</span>
                  <Badge variant="outline">Ollama</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Default Model:</span>
                  <Badge variant="outline">CodeLlama-13B</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Context Window:</span>
                  <Badge variant="outline">4096 tokens</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Quantization:</span>
                  <Badge variant="outline">4-bit</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}