'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Star, 
  Download, 
  ExternalLink, 
  Github, 
  Filter,
  Code,
  Zap,
  Database,
  Globe,
  Smartphone,
  Cpu,
  DollarSign,
  Users,
  Clock
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  author: {
    name: string
    email: string
    github: string
  }
  version: string
  price: number
  tags: string[]
  downloads: number
  rating: number
  reviews: number
  featured: boolean
  repository: string
  resources: {
    cpu: string
    memory: string
    disk: string
  }
  compatibility: {
    minBillingTier: string
    requiresDocker: boolean
    requiresGPU: boolean
  }
}

const mockTemplates: Template[] = [
  {
    id: 'react-starter',
    name: 'React + TypeScript Starter',
    description: 'Modern React development environment with TypeScript, Tailwind CSS, and essential tools',
    category: 'web',
    author: {
      name: 'Ultra DevBox Team',
      email: 'team@ultra-devbox.com',
      github: 'ultra-devbox'
    },
    version: '1.2.0',
    price: 0,
    tags: ['react', 'typescript', 'tailwind', 'vite'],
    downloads: 1250,
    rating: 4.8,
    reviews: 42,
    featured: true,
    repository: 'https://github.com/ultra-devbox/react-starter',
    resources: {
      cpu: '2',
      memory: '4Gi',
      disk: '10Gi'
    },
    compatibility: {
      minBillingTier: 'FREE',
      requiresDocker: false,
      requiresGPU: false
    }
  },
  {
    id: 'python-ml',
    name: 'Python Machine Learning',
    description: 'Complete Python ML environment with Jupyter, TensorFlow, PyTorch, and data science tools',
    category: 'ai',
    author: {
      name: 'Ultra DevBox Team',
      email: 'team@ultra-devbox.com',
      github: 'ultra-devbox'
    },
    version: '1.5.0',
    price: 0,
    tags: ['python', 'machine-learning', 'jupyter', 'tensorflow', 'pytorch'],
    downloads: 890,
    rating: 4.9,
    reviews: 28,
    featured: true,
    repository: 'https://github.com/ultra-devbox/python-ml',
    resources: {
      cpu: '4',
      memory: '8Gi',
      disk: '20Gi'
    },
    compatibility: {
      minBillingTier: 'STARTER',
      requiresDocker: true,
      requiresGPU: true
    }
  },
  {
    id: 'microservices-node',
    name: 'Node.js Microservices',
    description: 'Complete microservices architecture with Node.js, Docker, Kubernetes, and service mesh',
    category: 'development',
    author: {
      name: 'Ultra DevBox Team',
      email: 'team@ultra-devbox.com',
      github: 'ultra-devbox'
    },
    version: '2.1.0',
    price: 999,
    tags: ['nodejs', 'microservices', 'docker', 'kubernetes', 'istio'],
    downloads: 567,
    rating: 4.7,
    reviews: 15,
    featured: false,
    repository: 'https://github.com/ultra-devbox/microservices-node',
    resources: {
      cpu: '4',
      memory: '8Gi',
      disk: '30Gi'
    },
    compatibility: {
      minBillingTier: 'PRO',
      requiresDocker: true,
      requiresGPU: false
    }
  }
]

const categories = [
  { id: 'all', name: 'All Templates', icon: Code },
  { id: 'web', name: 'Web Development', icon: Globe },
  { id: 'ai', name: 'AI & Machine Learning', icon: Cpu },
  { id: 'database', name: 'Database & Data', icon: Database },
  { id: 'mobile', name: 'Mobile Development', icon: Smartphone },
  { id: 'devops', name: 'DevOps & Infrastructure', icon: Zap },
]

export default function Marketplace() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(mockTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    let filtered = templates

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.version.localeCompare(a.version))
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
    }

    setFilteredTemplates(filtered)
  }, [templates, searchTerm, selectedCategory, sortBy])

  const handleUseTemplate = (template: Template) => {
    // This would open the template in Ultra DevBox
    console.log('Using template:', template.id)
    window.open(`/workspace?template=${template.id}`, '_blank')
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : Code
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Template Marketplace</h2>
        <p className="text-lg text-slate-600">
          Discover and use pre-configured development environments
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          )
        })}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const CategoryIcon = getCategoryIcon(template.category)
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  {template.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{template.rating}</span>
                    <span>({template.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Resources */}
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Resources:</span>
                    <span>{template.resources.cpu} CPU, {template.resources.memory} RAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Tier:</span>
                    <Badge variant="outline" className="text-xs">
                      {template.compatibility.minBillingTier}
                    </Badge>
                  </div>
                </div>

                {/* Compatibility */}
                <div className="flex gap-2">
                  {template.compatibility.requiresDocker && (
                    <Badge variant="outline" className="text-xs">Docker</Badge>
                  )}
                  {template.compatibility.requiresGPU && (
                    <Badge variant="outline" className="text-xs">GPU</Badge>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {template.price === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      <span className="font-semibold">${template.price}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(template.repository, '_blank')}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <Filter className="h-12 w-12 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No templates found</h3>
                <p className="text-slate-600">
                  Try adjusting your search terms or filters
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSortBy('popular')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Template CTA */}
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Create Your Own Template</h3>
            <p className="text-slate-600">
              Share your development environment with the community and earn 80% of all revenue
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Code className="h-4 w-4 mr-2" />
                Submit Template
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}