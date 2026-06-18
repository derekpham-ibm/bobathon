import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tasksAPI } from '../services/api'
import { CheckCircle, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react'

function Dashboard({ user, token }) {
  const [progress, setProgress] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [token])

  const loadDashboardData = async () => {
    try {
      const [progressData, tasksData] = await Promise.all([
        tasksAPI.getProgress(token),
        tasksAPI.getTasks(token)
      ])
      setProgress(progressData)
      setTasks(tasksData.filter(t => t.status !== 'completed').slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { title: 'View All Tasks', path: '/tasks', icon: CheckCircle, color: 'bg-blue-500' },
    { title: 'Browse Resources', path: '/resources', icon: Calendar, color: 'bg-green-500' },
    { title: 'Ask Watson', path: '/chat', icon: Sparkles, color: 'bg-purple-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-ibm-blue-500 to-ibm-blue-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to IBM, {user?.first_name}! 🎉
        </h1>
        <p className="text-ibm-blue-100 text-lg">
          Your onboarding journey starts here. Let's get you up to speed!
        </p>
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Onboarding Completion</span>
              <span className="font-semibold">{progress.completion_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-ibm-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.completion_percentage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.completed_tasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{progress.in_progress_tasks}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{progress.pending_tasks}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.path}
                to={action.path}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${action.color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-ibm-blue-600 transition-colors">
                      {action.title}
                    </h3>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-ibm-blue-600 transition-colors" size={20} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Tasks</h2>
          <Link to="/tasks" className="text-ibm-blue-600 hover:text-ibm-blue-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="mt-1">
                  {task.status === 'in_progress' ? (
                    <Clock className="text-yellow-500" size={20} />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {task.estimated_time}
                    </span>
                    {task.due_date && (
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
            <p>All tasks completed! Great job! 🎉</p>
          </div>
        )}
      </div>

      {/* User Info Card */}
      <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-semibold text-gray-800">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-semibold text-gray-800">{user?.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold text-gray-800">{user?.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Manager</p>
            <p className="font-semibold text-gray-800">{user?.manager}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="font-semibold text-gray-800">
              {user?.start_date ? new Date(user.start_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// Made with Bob
