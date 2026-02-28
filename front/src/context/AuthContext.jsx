import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const API = 'http://localhost:5000/api/auth'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const token = localStorage.getItem('maison_token')
    if (!token) {
      setIsLoading(false)
      return
    }
    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setUser({ id: data._id, name: data.name, email: data.email, role: data.role })
        else localStorage.removeItem('maison_token')
      })
      .catch(() => localStorage.removeItem('maison_token'))
      .finally(() => setIsLoading(false))
  }, [])

  async function register(name, email, password) {
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.message }

      localStorage.setItem('maison_token', data.token)
      setUser(data.user)
      return { success: true }
    } catch {
      return { success: false, error: 'Server error' }
    }
  }

  async function login(email, password) {
  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.message }

    localStorage.setItem('maison_token', data.token)
    setUser(data.user)
    return { success: true, role: data.user.role }
  } catch {
    return { success: false, error: 'Server error' }
  }
}

  function logout() {
    localStorage.removeItem('maison_token')
    setUser(null)
  }

  async function updateProfile(updates) {
    try {
      const token = localStorage.getItem('maison_token')
      const res = await fetch(`${API}/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.message }

      setUser(prev => ({ ...prev, ...updates }))
      return { success: true }
    } catch {
      return { success: false, error: 'Server error' }
    }
  }


  function authFetch(url, options = {}) {
    const token = localStorage.getItem('maison_token')
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    })
  }

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    authFetch,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}