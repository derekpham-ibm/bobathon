import { useState, useEffect, useMemo } from 'react'
import { resourcesAPI } from '../services/api'
import {
  BookOpen,
  Clock3,
  FileText,
  Link as LinkIcon,
  Search,
  Video,
} from 'lucide-react'

function Resources() {
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeStarterPack, setActiveStarterPack] = useState(null)

  useEffect(() => {
    loadResources()
    loadCategories()
  }, [])

  const loadResources = async () => {
    try {
      const data = await resourcesAPI.getResources()
      setResources(data)
    } catch (error) {
      console.error('Failed to load resources:', error)
      // Fallback to IBM-relevant sample resources if API fails
      setResources([
        {
          id: 1,
          title: 'IBM w3 Access Setup',
          description: 'Complete guide to setting up your IBM w3 account, accessing internal tools, and navigating IBM\'s intranet.',
          category: 'IBM Systems',
          type: 'guide',
          estimated_read_time: '30 min',
          tags: ['w3', 'access', 'intranet'],
          url: '#w3-access'
        },
        {
          id: 2,
          title: 'IBM Benefits & Wellness',
          description: 'Comprehensive overview of IBM health plans, 401k matching, wellness programs, and employee assistance resources.',
          category: 'HR & Benefits',
          type: 'link',
          estimated_read_time: '45 min',
          tags: ['benefits', 'health', 'wellness'],
          url: '#ibm-benefits'
        },
        {
          id: 3,
          title: 'Slack & Teams Communication',
          description: 'Join essential IBM Slack workspaces and Microsoft Teams channels. Learn communication best practices.',
          category: 'Collaboration',
          type: 'guide',
          estimated_read_time: '20 min',
          tags: ['slack', 'teams', 'communication'],
          url: '#communication-tools'
        },
        {
          id: 4,
          title: 'IBM Development Environment',
          description: 'Set up your IBM-issued laptop, VPN access, GitHub Enterprise, and development tools for your role.',
          category: 'Technical Setup',
          type: 'guide',
          estimated_read_time: '2 hours',
          tags: ['laptop', 'vpn', 'github', 'tools'],
          url: '#dev-environment'
        },
        {
          id: 5,
          title: 'Security & Compliance Training',
          description: 'Required IBM security awareness, data protection, and compliance training modules.',
          category: 'Training',
          type: 'video',
          estimated_read_time: '90 min',
          tags: ['security', 'compliance', 'required'],
          url: '#security-training'
        },
        {
          id: 6,
          title: 'Your Learning Portal',
          description: 'Access IBM\'s learning platform for technical courses, certifications, and professional development.',
          category: 'Training',
          type: 'link',
          estimated_read_time: '15 min',
          tags: ['learning', 'courses', 'certifications'],
          url: '#your-learning'
        },
        {
          id: 7,
          title: 'Team Project Documentation',
          description: 'Current project specs, architecture docs, and team roadmap. Understand what we\'re building.',
          category: 'Collaboration',
          type: 'document',
          estimated_read_time: '45 min',
          tags: ['projects', 'architecture', 'roadmap'],
          url: '#project-docs'
        },
        {
          id: 8,
          title: 'IBM Manager & Buddy Program',
          description: 'Connect with your manager and assigned buddy. Schedule your first 1:1s and onboarding check-ins.',
          category: 'HR & Benefits',
          type: 'guide',
          estimated_read_time: '20 min',
          tags: ['manager', 'buddy', 'mentorship'],
          url: '#manager-buddy'
        },
        {
          id: 9,
          title: 'First Week at IBM Checklist',
          description: 'Day-by-day guide for your first week: required trainings, meetings, and essential setup tasks.',
          category: 'Onboarding',
          type: 'guide',
          estimated_read_time: '15 min',
          tags: ['checklist', 'first-week', 'onboarding'],
          url: '#first-week'
        },
        {
          id: 10,
          title: 'IBM Code Standards & Review',
          description: 'IBM\'s coding standards, pull request guidelines, and code review best practices for your team.',
          category: 'Technical Setup',
          type: 'guide',
          estimated_read_time: '30 min',
          tags: ['code-review', 'standards', 'best-practices'],
          url: '#code-standards'
        },
        {
          id: 11,
          title: 'Time Off & Holiday Schedule',
          description: 'IBM PTO policy, holiday calendar, and how to request time off through the HR system.',
          category: 'HR & Benefits',
          type: 'document',
          estimated_read_time: '15 min',
          tags: ['pto', 'holidays', 'time-off'],
          url: '#pto-policy'
        },
        {
          id: 12,
          title: 'IBM Org Chart & Contacts',
          description: 'Navigate IBM\'s organizational structure, find key contacts, and understand reporting lines.',
          category: 'Collaboration',
          type: 'document',
          estimated_read_time: '10 min',
          tags: ['org-chart', 'contacts', 'structure'],
          url: '#org-chart'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await resourcesAPI.getCategories()
      setCategories(['all', ...data.categories])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadResources()
      return
    }

    try {
      const data = await resourcesAPI.searchResources(searchQuery)
      setResources(data)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const filteredResources = useMemo(() => {
    let filtered = resources

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((resource) => resource.category === selectedCategory)
    }

    // Filter by active starter pack
    if (activeStarterPack !== null) {
      filtered = filtered.filter((resource) => resource.id === activeStarterPack)
    }

    return filtered
  }, [resources, selectedCategory, activeStarterPack])

  const getIcon = (type) => {
    switch (type) {
      case 'video':
        return Video
      case 'link':
        return LinkIcon
      case 'guide':
        return BookOpen
      default:
        return FileText
    }
  }

  const handleStarterPackClick = (itemId) => {
    const resource = resources.find(r => r.id === itemId)
    if (resource) {
      setActiveStarterPack(itemId)
      setSelectedCategory(resource.category)
      setSearchQuery('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const clearFilters = () => {
    setActiveStarterPack(null)
    setSelectedCategory('all')
    setSearchQuery('')
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="card-muted text-sm text-[#6f6f6f]">Loading resources…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="card border-l-4 border-[#0f62fe]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#0f62fe]">IBM Internal Resources</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#161616]">
              One place for IBM guides, docs, links, and onboarding references.
            </h2>
            <p className="mt-3 text-sm text-[#525252]">
              Use this hub to find the right IBM handbook, setup guide, or team documentation without hunting across tools.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Available</p>
              <p className="mt-2 text-3xl font-semibold text-[#161616]">{resources.length}</p>
            </div>
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Categories</p>
              <p className="mt-2 text-3xl font-semibold text-[#0f62fe]">
                {Math.max(categories.length - 1, 0)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_320px]">
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="card">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f6f6f]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search onboarding resources..."
                  className="input-field pl-11"
                />
              </div>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <div className="segmented-control">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setActiveStarterPack(null)
                  }}
                  className={selectedCategory === category ? 'segmented-option-active' : 'segmented-option'}
                >
                  {category === 'all' ? 'All resources' : category}
                </button>
              ))}
            </div>
            {(activeStarterPack !== null || selectedCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="btn-secondary text-xs"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResources.map((resource) => {
                const Icon = getIcon(resource.type)

                return (
                  <div key={resource.id} className="card-muted transition-transform duration-200 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0043ce]">
                        <Icon size={20} />
                      </div>
                      <span className="status-badge status-todo">{resource.type || 'doc'}</span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-[#161616]">{resource.title}</h3>
                    <p className="mt-2 text-sm text-[#525252]">{resource.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="status-badge status-progress">{resource.category || 'General'}</span>
                      {resource.estimated_read_time && (
                        <span className="status-badge status-todo">
                          <Clock3 size={12} className="mr-1" />
                          {resource.estimated_read_time}
                        </span>
                      )}
                    </div>

                    {resource.tags && resource.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#525252]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f4f4f4] text-[#525252]">
                <BookOpen size={30} />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#161616]">
                No resources found
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[#525252]">
                Try a different search term or switch categories to broaden the results.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="card border-l-4 border-[#198038]">
            <p className="text-sm font-medium text-[#198038]">IBM Onboarding Starter Pack</p>
            <div className="mt-4 space-y-3">
              {[
                { title: 'IBM w3 Access Setup', id: 1 },
                { title: 'IBM Benefits & Wellness', id: 2 },
                { title: 'Slack & Teams Communication', id: 3 },
                { title: 'IBM Development Environment', id: 4 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleStarterPackClick(item.id)}
                  className={`w-full card-muted p-4 transition-all hover:bg-[#ebebeb] hover:shadow-md cursor-pointer text-left border-2 ${
                    activeStarterPack === item.id ? 'border-[#0f62fe] bg-[#d0e2ff]' : 'border-transparent'
                  }`}
                >
                  <p className="text-sm font-semibold text-[#161616]">{item.title}</p>
                  <p className="mt-1 text-xs text-[#525252]">Recommended for your first week.</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-medium text-[#6f6f6f]">How this helps</p>
            <div className="mt-4 space-y-3 text-sm text-[#525252]">
              <p>Keep onboarding links centralized instead of scattered across email, chat, and docs.</p>
              <p>Use categories to jump quickly between HR, team, and technical setup materials.</p>
              <p>Pair this page with your task list so each step has the right supporting resource.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Resources

// Made with Bob
