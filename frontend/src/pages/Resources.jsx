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
    return selectedCategory === 'all'
      ? resources
      : resources.filter((resource) => resource.category === selectedCategory)
  }, [resources, selectedCategory])

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

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="card-muted text-sm text-[#6f6f6f]">Loading resources…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#6f6f6f]">Resources</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#161616]">
              One place for guides, docs, links, and onboarding references.
            </h2>
            <p className="mt-3 text-sm text-[#525252]">
              Use this hub to find the right handbook, setup guide, or team documentation without hunting across tools.
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

          <div className="segmented-control">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'segmented-option-active' : 'segmented-option'}
              >
                {category === 'all' ? 'All resources' : category}
              </button>
            ))}
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
          <div className="card">
            <p className="text-sm font-medium text-[#6f6f6f]">Suggested starter pack</p>
            <div className="mt-4 space-y-3">
              {[
                'Employee Handbook',
                'Benefits Portal',
                'Team Wiki',
                'Engineering Setup Guide',
              ].map((item) => (
                <div key={item} className="card-muted p-4">
                  <p className="text-sm font-semibold text-[#161616]">{item}</p>
                  <p className="mt-1 text-sm text-[#525252]">Recommended for your first week.</p>
                </div>
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
