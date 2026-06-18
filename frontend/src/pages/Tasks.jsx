import { useState, useEffect } from 'react'
import { tasksAPI } from '../services/api'
import { CheckCircle, Circle, Clock, Calendar, AlertCircle } from 'lucide-react'

function Tasks({ user, token }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [token])

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getTasks(token)
      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      await tasksAPI.completeTask(taskId, token)
      await loadTasks()
    } catch (error) {
      console.error('Failed to complete task:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'pending') return task.status === 'pending'
    if (filter === 'in_progress') return task.status === 'in_progress'
    if (filter === 'completed') return task.status === 'completed'
    return true
  })

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = []
    }
    acc[task.category].push(task)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Onboarding Tasks</h1>
        <p className="text-gray-600 mt-2">
          Complete these tasks to get fully onboarded at IBM
        </p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'pending', 'in_progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-ibm-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.replace('_', ' ').charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks by Category */}
      {Object.keys(groupedTasks).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
            <div key={category} className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
              <div className="space-y-3">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      task.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : task.status === 'in_progress'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-white border-gray-200 hover:border-ibm-blue-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {task.status === 'completed' ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : task.status === 'in_progress' ? (
                          <Clock className="text-yellow-600" size={24} />
                        ) : (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                          >
                            <Circle className="text-gray-400" size={24} />
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                          <span className="flex items-center text-gray-600">
                            <Clock size={14} className="mr-1" />
                            {task.estimated_time}
                          </span>
                          
                          {task.due_date && (
                            <span className="flex items-center text-gray-600">
                              <Calendar size={14} className="mr-1" />
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                          
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority} priority
                          </span>
                          
                          {task.status === 'completed' && task.completed_date && (
                            <span className="text-green-600 font-medium">
                              ✓ Completed {new Date(task.completed_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {task.dependencies && task.dependencies.length > 0 && (
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <AlertCircle size={14} className="mr-1" />
                            Depends on {task.dependencies.length} other task(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'You have no tasks assigned yet.'
              : `You have no ${filter.replace('_', ' ')} tasks.`}
          </p>
        </div>
      )}
    </div>
  )
}

export default Tasks

// Made with Bob
