'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Github, Search, Filter, Star, GitBranch, Package } from 'lucide-react'

interface Component {
  purpose: string
  repo: string
  license: string
  description: string
  stars?: number
  language: string
  category: string
  url: string
}

const components: Component[] = [
  {
    purpose: 'Platform / orchestration',
    repo: 'coder/coder',
    license: 'AGPL-3.0',
    description: 'Remote development environments on your own infrastructure',
    stars: 11234,
    language: 'Go',
    category: 'platform',
    url: 'https://github.com/coder/coder'
  },
  {
    purpose: 'Web IDE',
    repo: 'gitpod-io/openvscode-server',
    license: 'MIT',
    description: 'Run VS Code in the browser or on a remote server',
    stars: 8756,
    language: 'TypeScript',
    category: 'ide',
    url: 'https://github.com/gitpod-io/openvscode-server'
  },
  {
    purpose: 'Terminal',
    repo: 'xtermjs/xterm.js',
    license: 'MIT',
    description: 'Terminal emulator for the web',
    stars: 15432,
    language: 'TypeScript',
    category: 'terminal',
    url: 'https://github.com/xtermjs/xterm.js'
  },
  {
    purpose: 'Docker-in-Docker',
    repo: 'docker:dind image',
    license: 'Apache-2.0',
    description: 'Official Docker image with DinD support',
    stars: 0,
    language: 'Dockerfile',
    category: 'container',
    url: 'https://hub.docker.com/_/docker'
  },
  {
    purpose: 'Dev Container spec',
    repo: 'devcontainers/cli',
    license: 'MIT',
    description: 'Reference implementation for Dev Container specification',
    stars: 3456,
    language: 'TypeScript',
    category: 'devcontainer',
    url: 'https://github.com/devcontainers/cli'
  },
  {
    purpose: 'LLM inference',
    repo: 'jmorganca/ollama',
    license: 'MIT',
    description: 'Get up and running with Llama 2 and other large language models',
    stars: 67890,
    language: 'Go',
    category: 'ai',
    url: 'https://github.com/jmorganca/ollama'
  },
  {
    purpose: 'LLM models',
    repo: 'codellama/CodeLlama-13B-Instruct-hf',
    license: 'Llama-2',
    description: 'Code completion and generation model',
    stars: 12890,
    language: 'Python',
    category: 'ai',
    url: 'https://huggingface.co/codellama/CodeLlama-13B-Instruct-hf'
  },
  {
    purpose: 'Auth & ingress',
    repo: 'traefik/traefik',
    license: 'MIT',
    description: 'The Cloud Native Application Proxy',
    stars: 45678,
    language: 'Go',
    category: 'networking',
    url: 'https://github.com/traefik/traefik'
  },
  {
    purpose: 'Auth & ingress',
    repo: 'oauth2-proxy/oauth2-proxy',
    license: 'MIT',
    description: 'A reverse proxy that provides authentication with Google, Github or other providers',
    stars: 7890,
    language: 'Go',
    category: 'networking',
    url: 'https://github.com/oauth2-proxy/oauth2-proxy'
  },
  {
    purpose: 'VS Code Extension',
    repo: 'continue-extension/continue',
    license: 'MIT',
    description: 'VS Code extension for AI-powered code completion',
    stars: 12345,
    language: 'TypeScript',
    category: 'extension',
    url: 'https://github.com/continue-extension/continue'
  },
  {
    purpose: 'Alternative Platform',
    repo: 'loft-sh/devpod',
    license: 'Apache-2.0',
    description: 'Spin up dev environments in any cloud, VM, or localhost',
    stars: 5678,
    language: 'Go',
    category: 'platform',
    url: 'https://github.com/loft-sh/devpod'
  },
  {
    purpose: 'Container Runtime',
    repo: 'kata-containers/kata-containers',
    license: 'Apache-2.0',
    description: 'Secure container runtime with lightweight VMs',
    stars: 3456,
    language: 'Go',
    category: 'security',
    url: 'https://github.com/kata-containers/kata-containers'
  }
]

const categories = [
  { value: 'all', label: 'All Components' },
  { value: 'platform', label: 'Platform' },
  { value: 'ide', label: 'IDE' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'container', label: 'Container' },
  { value: 'ai', label: 'AI/LLM' },
  { value: 'networking', label: 'Networking' },
  { value: 'security', label: 'Security' },
  { value: 'extension', label: 'Extensions' },
  { value: 'devcontainer', label: 'Dev Containers' }
]

const licenseColors: Record<string, string> = {
  'MIT': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Apache-2.0': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'AGPL-3.0': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Llama-2': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
}

const languageColors: Record<string, string> = {
  'Go': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  'TypeScript': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Python': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Dockerfile': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
}

export default function ComponentsTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalStars = components.reduce((sum, comp) => sum + (comp.stars || 0), 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{components.length}</p>
                <p className="text-sm text-slate-600">Total Components</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{totalStars.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Stars</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-slate-600">Open Source</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">MIT</p>
                <p className="text-sm text-slate-600">Primary License</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Components
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Table */}
      <Card>
        <CardHeader>
          <CardTitle>Open-Source Components</CardTitle>
          <CardDescription>
            All components used in Ultra DevBox are open-source with permissive licenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Purpose</th>
                  <th className="text-left p-4 font-semibold">Repository</th>
                  <th className="text-left p-4 font-semibold">License</th>
                  <th className="text-left p-4 font-semibold">Language</th>
                  <th className="text-left p-4 font-semibold">Stars</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComponents.map((component, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{component.purpose}</p>
                        <p className="text-sm text-slate-600 mt-1">{component.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-slate-600" />
                        <span className="font-mono text-sm">{component.repo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={licenseColors[component.license] || 'bg-gray-100 text-gray-800'}>
                        {component.license}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={languageColors[component.language] || 'bg-gray-100 text-gray-800'}>
                        {component.language}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {component.stars ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{component.stars.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="outline" asChild>
                        <a href={component.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredComponents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600">No components found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* License Summary */}
      <Card>
        <CardHeader>
          <CardTitle>License Summary</CardTitle>
          <CardDescription>
            Understanding the licensing for enterprise use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Permissive Licenses (Recommended)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">MIT License</p>
                    <p className="text-sm text-slate-600">Most permissive, allows commercial use</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">8 components</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Apache 2.0</p>
                    <p className="text-sm text-slate-600">Permissive with patent protection</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">3 components</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Copyleft Licenses</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">AGPL 3.0</p>
                    <p className="text-sm text-slate-600">Requires source disclosure if used as service</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">1 component</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Llama 2</p>
                    <p className="text-sm text-slate-600">Custom license for LLM models</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">1 component</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Options */}
      <Card>
        <CardHeader>
          <CardTitle>Alternative Components</CardTitle>
          <CardDescription>
            Other open-source options you can substitute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-2">Platform Alternatives</h5>
              <ul className="space-y-1 text-sm">
                <li>• <code>loft-sh/devpod</code> - Alternative to Coder</li>
                <li>• <code>daytonaio/daytona</code> - Development environment manager</li>
                <li>• <code>devpod-builtin/devpod</code> - Self-hosted option</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-2">IDE Alternatives</h5>
              <ul className="space-y-1 text-sm">
                <li>• <code>coder/coder-vscode</code> - Coder's VS Code fork</li>
                <li>• <code>theia-ide/theia</code> - Eclipse Theia IDE</li>
                <li>• <code>code-server</code> - VS Code on remote machines</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-2">LLM Alternatives</h5>
              <ul className="space-y-1 text-sm">
                <li>• <code>text-generation-webui</code> - Web UI for LLMs</li>
                <li>• <code>localai/localai</code> - Local AI API</li>
                <li>• <code>tabbyml/tabby</code> - Self-hosted AI coding assistant</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-2">Security Alternatives</h5>
              <ul className="space-y-1 text-sm">
                <li>• <code>gvisor/gvisor</code> - Application kernel for containers</li>
                <li>• <code>firecracker-microvm/firecracker</code> - Secure microVMs</li>
                <li>• <code>nabla-containers/nabla-containers</code> - Minimal containers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}