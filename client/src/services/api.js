import axios from 'axios'

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Normalize URL so both 'https://app.onrender.com' and 'https://app.onrender.com/api' work seamlessly
const getNormalizedBaseUrl = (url) => {
  if (!url) return 'http://localhost:5000/api'
  const trimmed = url.replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const API = axios.create({
  baseURL: getNormalizedBaseUrl(rawApiUrl)
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    return Promise.reject(error)
  }
)

export default API
