'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Terminal, Code, Zap, AlertCircle, ExternalLink, Github } from 'lucide-react'

export default function BoltPage() {
  const searchParams = useSearchParams()
  const repoUrl = searchParams.get('repo')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [webcontainerLoaded, setWebcontainerLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Load StackBlitz WebContainers
    const loadWebContainer = async () => {
      try {
        setIsLoading(true)
        
        // Initialize WebContainer API
        if (!window.WebContainer) {
          // Load WebContainer script dynamically
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/@webcontainer/api@1.1.0/dist/index.js'
          script.async = true
          script.onload = async () => {
            try {
              // WebContainer is now available
              setWebcontainerLoaded(true)
              
              // If repo URL is provided, clone and setup
              if (repoUrl) {
                await setupRepository(repoUrl)
              }
              
              setIsLoading(false)
            } catch (err) {
              setError('Failed to initialize WebContainer environment')
              setIsLoading(false)
            }
          }
          script.onerror = () => {
            setError('Failed to load WebContainer API')
            setIsLoading(false)
          }
          document.head.appendChild(script)
        } else {
          setWebcontainerLoaded(true)
          setIsLoading(false)
        }
      } catch (err) {
        setError('Failed to load development environment')
        setIsLoading(false)
      }
    }

    loadWebContainer()
  }, [repoUrl])

  const setupRepository = async (repo: string) => {
    try {
      // This would integrate with StackBlitz to clone and setup the repo
      console.log('Setting up repository:', repo)
    } catch (err) {
      setError('Failed to setup repository')
    }
  }

  const handleOpenInStackBlitz = () => {
    const stackBlitzUrl = repoUrl 
      ? `https://stackblitz.com/github/${repoUrl.replace('https://github.com/', '')}`
      : 'https://stackblitz.com/'
    window.open(stackBlitzUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <div className="text-center">
                <h3 className="font-semibold">Loading Bolt Environment</h3>
                <p className="text-sm text-slate-600">Setting up your instant development environment...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="text-center">
                <h3 className="font-semibold text-red-600">Environment Error</h3>
                <p className="text-sm text-slate-600">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold">Bolt Environment</h1>
                <p className="text-sm text-slate-600">Instant browser-based development</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">WebContainers</Badge>
              <Badge variant="secondary">Zero Infrastructure</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Environment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type</span>
                  <Badge variant="outline">WebContainer</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Runtime</span>
                  <Badge variant="outline">Node.js</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="default">Ready</Badge>
                </div>
                {repoUrl && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Repository:</p>
                    <p className="text-xs text-slate-600 break-all">{repoUrl}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={handleOpenInStackBlitz}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in StackBlitz
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/'}
                >
                  Switch to Ultra DevBox
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Code className="h-4 w-4 text-green-600" />
                  <span>VS Code Editor</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Terminal className="h-4 w-4 text-blue-600" />
                  <span>Terminal Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span>Hot Reload</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Github className="h-4 w-4 text-purple-600" />
                  <span>Git Integration</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Development Environment</CardTitle>
                    <CardDescription>
                      {repoUrl ? `Working with ${repoUrl}` : 'Ready for development'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Powered by StackBlitz</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[520px]">
                {webcontainerLoaded ? (
                  <iframe
                    ref={iframeRef}
                    src={repoUrl 
                      ? `https://stackblitz.com/github/${repoUrl.replace('https://github.com/', '')}?embed=1`
                      : 'https://stackblitz.com/edit/react-starter?embed=1'
                    }
                    className="w-full h-full border-0"
                    title="Development Environment"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
                      <p className="text-sm text-slate-600">Initializing development environment...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Bolt Environment:</strong> This is a lightweight, browser-based development environment 
                perfect for quick experiments and JavaScript/TypeScript projects. For full Docker support, 
                AI assistance, and multi-service applications, switch to the complete Ultra DevBox environment.
              </AlertDescription>
            </Alert>

            {/* Comparison */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Bolt Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Instant setup (seconds)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>No infrastructure required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Perfect for JS/TS projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-600">✗</span>
                    <span>No Docker support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-600">✗</span>
                    <span>Limited to single projects</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    Ultra DevBox
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Real Docker-in-Docker</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>AI-powered development</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Multi-service applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Full development stack</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Self-hosted option</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}