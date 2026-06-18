import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  logout: async (token) => {
    const response = await api.post('/auth/logout', null, {
      params: { token }
    })
    return response.data
  },
}

// User API
export const userAPI = {
  getCurrentUser: async (token) => {
    const response = await api.get('/users/me', {
      params: { token }
    })
    return response.data
  },
}

// Tasks API
export const tasksAPI = {
  getTasks: async (token) => {
    const response = await api.get('/tasks', {
      params: { token }
    })
    return response.data
  },
  
  completeTask: async (taskId, token) => {
    const response = await api.put(`/tasks/${taskId}/complete`, null, {
      params: { token }
    })
    return response.data
  },
  
  getProgress: async (token) => {
    const response = await api.get('/tasks/progress', {
      params: { token }
    })
    return response.data
  },
}

// Resources API
export const resourcesAPI = {
  getResources: async (category = null) => {
    const params = category ? { category } : {}
    const response = await api.get('/resources', { params })
    return response.data
  },
  
  getCategories: async () => {
    const response = await api.get('/resources/categories')
    return response.data
  },
  
  searchResources: async (query) => {
    const response = await api.get('/resources/search', {
      params: { q: query }
    })
    return response.data
  },
}

// Chat API
export const chatAPI = {
  sendMessage: async (message, token) => {
    const response = await api.post('/chat/message', 
      { message },
      { params: { token } }
    )
    return response.data
  },
  
  getHistory: async (token) => {
    const response = await api.get('/chat/history', {
      params: { token }
    })
    return response.data
  },
}

export default api

// Made with Bob
