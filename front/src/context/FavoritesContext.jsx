import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)
const API = 'http://localhost:5000/api/auth'

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

export function FavoritesProvider({ children }) {
  const { user, authFetch } = useAuth()
  const [favorites, setFavorites] = useState([])


  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }
    authFetch(`${API}/me`)
      .then(r => r.json())
      .then(data => setFavorites(data.favorites || []))
      .catch(() => setFavorites([]))
  }, [user])

  async function toggleFavorite(productId) {
    if (!user) return


    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )

    try {
      const res = await authFetch(`${API}/favorites/${productId}`, { method: 'POST' })
      const data = await res.json()

      setFavorites(data.favorites || [])
    } catch {

      setFavorites(prev =>
        prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      )
    }
  }

  function isFavorite(productId) {
    return favorites.includes(productId)
  }

  const value = { favorites, toggleFavorite, isFavorite, count: favorites.length }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}