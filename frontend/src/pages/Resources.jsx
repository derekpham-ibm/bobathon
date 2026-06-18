import { useState, useEffect } from 'react'
import { resourcesAPI } from '../services/api'
import { Search, FileText, Video, Link as LinkIcon, BookOpen, Clock } from 'lucide-react'

function Resources({ token }) {
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

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(r => r.category === selectedCategory)

  const getIcon = (type) => {
    switch (type) {
      case 'video': return Video
      case 'link': return LinkIcon
      case 'guide': return BookOpen
      default: return FileText
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading resources...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Resource Hub</h1>
        <p className="text-gray-600 mt-2">
          Find guides, documentation, and training materials
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="card">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue-500"
            />
          </div>
          <button type="submit" className="btn-primary px-6">
            Search
          </button>
        </div>
      </form>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-ibm-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'All Resources' : category}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = getIcon(resource.type)
            return (
              <div
                key={resource.id}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="bg-ibm-blue-100 p-2 rounded-lg">
                    <Icon className="text-ibm-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {resource.type}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-ibm-blue-600 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {resource.category}
                  </span>
                  {resource.estimated_read_time && (
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {resource.estimated_read_time}
                    </span>
                  )}
                </div>
                
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                      >
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
        <div className="card text-center py-12">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No resources found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

export default Resources

// Made with Bob
