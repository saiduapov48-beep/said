import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext(null)

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('maison_favorites')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('maison_favorites', JSON.stringify(favorites))
  }, [favorites])

  function toggleFavorite(productId) {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  function isFavorite(productId) {
    return favorites.includes(productId)
  }

  const value = { favorites, toggleFavorite, isFavorite, count: favorites.length }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
