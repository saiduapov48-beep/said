import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)
const API = 'http://localhost:5000/api/cart'

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }) {
  const { user, authFetch } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) { setItems([]); return }
    authFetch(API)
      .then(r => r.json())
      .then(data => setItems(data.items || []))
      .catch(() => setItems([]))
  }, [user])

  async function addToCart(productId) {
    if (!user) return
    const res = await authFetch(API, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    })
    const data = await res.json()
    setItems(data.items || [])
  }

  async function removeFromCart(productId) {
    const res = await authFetch(`${API}/${productId}`, { method: 'DELETE' })
    const data = await res.json()
    setItems(data.items || [])
  }

  async function updateQuantity(productId, quantity) {
    const res = await authFetch(`${API}/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    })
    const data = await res.json()
    setItems(data.items || [])
  }

  async function clearCart() {
    await authFetch(API, { method: 'DELETE' })
    setItems([])
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0)

  const value = { items, addToCart, removeFromCart, updateQuantity, clearCart, count, total }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}