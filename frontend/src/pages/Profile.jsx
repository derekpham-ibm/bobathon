import { User, Mail, Briefcase, MapPin, Calendar, Building } from 'lucide-react'

function Profile({ user, token }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-2">
          View and manage your profile information
        </p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center space-x-6 mb-6 pb-6 border-b">
          <div className="w-24 h-24 bg-gradient-to-br from-ibm-blue-500 to-ibm-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-600">{user?.role}</p>
            <p className="text-sm text-gray-500 mt-1">{user?.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Briefcase className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium text-gray-800">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-800">{user?.department}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-800">{user?.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Manager</p>
                <p className="font-medium text-gray-800">{user?.manager}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium text-gray-800">
                  {user?.start_date ? new Date(user.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Days at IBM</h3>
          <p className="text-3xl font-bold text-blue-600">
            {user?.start_date ? Math.floor((new Date() - new Date(user.start_date)) / (1000 * 60 * 60 * 24)) : 0}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="text-sm font-medium text-green-900 mb-2">Tasks Completed</h3>
          <p className="text-3xl font-bold text-green-600">-</p>
          <p className="text-xs text-green-700 mt-1">View in Tasks page</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <h3 className="text-sm font-medium text-purple-900 mb-2">Resources Viewed</h3>
          <p className="text-3xl font-bold text-purple-600">-</p>
          <p className="text-xs text-purple-700 mt-1">Coming soon</p>
        </div>
      </div>

      {/* Additional Information */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">About This Profile</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            This is a demo profile for the IBM Blue Connect MVP. In a production environment, 
            this page would include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Editable profile fields</li>
            <li>Profile photo upload</li>
            <li>Notification preferences</li>
            <li>Privacy settings</li>
            <li>Connected accounts (GitHub, Slack, etc.)</li>
            <li>Learning progress and certifications</li>
            <li>Team connections and org chart</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="font-medium text-gray-800">Change Password</span>
            <p className="text-sm text-gray-500">Update your account password</p>
          </button>
          <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="font-medium text-gray-800">Notification Settings</span>
            <p className="text-sm text-gray-500">Manage email and push notifications</p>
          </button>
          <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="font-medium text-gray-800">Privacy & Security</span>
            <p className="text-sm text-gray-500">Control your data and privacy settings</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile

// Made with Bob
