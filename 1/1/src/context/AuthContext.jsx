import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('maison_session')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem('maison_session')
      }
    }
    setIsLoading(false)
  }, [])

  function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('maison_users') || '[]')
    const exists = users.find((u) => u.email === email)
    if (exists) {
      return { success: false, error: 'User with this email already exists' }
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: email === 'admin@maison.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    localStorage.setItem('maison_users', JSON.stringify(users))

    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt }
    localStorage.setItem('maison_session', JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem('maison_users') || '[]')
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) {
      return { success: false, error: 'Invalid email or password' }
    }
    const session = { id: found.id, name: found.name, email: found.email, role: found.role, createdAt: found.createdAt }
    localStorage.setItem('maison_session', JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  function logout() {
    localStorage.removeItem('maison_session')
    setUser(null)
  }

  function updateProfile(updates) {
    const users = JSON.parse(localStorage.getItem('maison_users') || '[]')
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates }
      localStorage.setItem('maison_users', JSON.stringify(users))
    }
    const newSession = { ...user, ...updates }
    localStorage.setItem('maison_session', JSON.stringify(newSession))
    setUser(newSession)
  }

  const value = { user, isLoading, register, login, logout, updateProfile, isAuthenticated: !!user }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
