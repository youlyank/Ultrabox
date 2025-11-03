'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Code, Terminal, Container, GitBranch, Zap, Users, Rocket, Shield, Github, ExternalLink, Check, Play, Copy } from 'lucide-react'
import ArchitectureDiagram from '@/components/ArchitectureDiagram'
import FeaturesShowcase from '@/components/FeaturesShowcase'
import SetupDemo from '@/components/SetupDemo'
import ComponentsTable from '@/components/ComponentsTable'
import WorkspaceDemo from '@/components/WorkspaceDemo'
import Marketplace from '@/components/Marketplace'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-6">
            <div className="flex justify-center space-x-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                Open Source
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Docker-Enabled
              </Badge>
              <Badge variant="secondary" className="text-xs">
                AI-Powered
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Ultra DevBox
              </span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl text-slate-600 dark:text-slate-300 mt-4 block">
                The Replit + Bolt Killer
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Per-user Docker-enabled dev environments with real Docker-in-Docker, 
              open-source LLM stack, and flexible deployment options.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                <Rocket className="mr-2 h-5 w-5" />
                Get Started in 60 Seconds
              </Button>
              <Button size="lg" variant="outline">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Bar */}
      <section className="border-y border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-3">
              <Container className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-semibold">Real Docker-in-Docker</p>
                <p className="text-sm text-slate-600">Multi-service apps</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-semibold">Open-Source LLM</p>
                <p className="text-sm text-slate-600">CodeLlama & StarCoder</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Terminal className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-semibold">VS Code in Browser</p>
                <p className="text-sm text-slate-600">Full IDE experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-semibold">Multi-User Ready</p>
                <p className="text-sm text-slate-600">Scale to teams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="setup">Quick Setup</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="marketplace">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-8">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-orange-600" />
                    What Makes Ultra DevBox Different
                  </CardTitle>
                  <CardDescription>
                    Unlike Replit and Bolt, we provide real containerization capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-orange-600">✅ What We Enable</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Real Docker-in-Docker for multi-service applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Build and push Docker images directly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Run docker compose with full networking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Open-source LLM stack (no vendor lock-in)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Self-hosted with full data control</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-600">❌ Replit/Bolt Limitations</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✕</span>
                          <span>No real Docker containerization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✕</span>
                          <span>Cannot build/push Docker images</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✕</span>
                          <span>Limited to single applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✕</span>
                          <span>Proprietary AI with usage limits</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✕</span>
                          <span>Cloud-only with data concerns</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                  <CardDescription>
                    Perfect for teams and developers who need real containerization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <GitBranch className="h-8 w-8 text-orange-600 mb-2" />
                      <h4 className="font-semibold mb-2">Microservices Development</h4>
                      <p className="text-sm text-slate-600">
                        Build and test multi-service applications with real Docker networking
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Code className="h-8 w-8 text-orange-600 mb-2" />
                      <h4 className="font-semibold mb-2">AI-Assisted Coding</h4>
                      <p className="text-sm text-slate-600">
                        Local CodeLlama/StarCoder for code completion and refactoring
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Users className="h-8 w-8 text-orange-600 mb-2" />
                      <h4 className="font-semibold mb-2">Team Collaboration</h4>
                      <p className="text-sm text-slate-600">
                        Consistent dev environments for entire teams with GitHub integration
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="architecture" className="mt-8">
            <ArchitectureDiagram />
          </TabsContent>
          
          <TabsContent value="features" className="mt-8">
            <FeaturesShowcase />
          </TabsContent>
          
          <TabsContent value="setup" className="mt-8">
            <SetupDemo />
          </TabsContent>
          
          <TabsContent value="components" className="mt-8">
            <ComponentsTable />
          </TabsContent>
          
          <TabsContent value="demo" className="mt-8">
            <WorkspaceDemo />
          </TabsContent>
          
          <TabsContent value="marketplace" className="mt-8">
            <Marketplace />
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Revolutionize Your Development Workflow?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join developers who are building the next generation of applications with real containerization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                <Play className="mr-2 h-5 w-5" />
                Start Your First Workspace
              </Button>
              <Button size="lg" variant="outline">
                <ExternalLink className="mr-2 h-5 w-5" />
                Read Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}