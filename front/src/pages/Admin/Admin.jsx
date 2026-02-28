import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import './Admin.css'
import './AdminOrders.css'

const API = 'http://localhost:5000/api'

const STATUS_COLORS = {
  pending: '#d4a574',
  sending: '#d4a574',
  accepting: '#d4a574',
  ready: '#7a9d84',
  completed: '#7a9d84',
  cancelled: '#c67c7c'
}

export default function Admin() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, pickup: 0, shipping: 0, revenue: 0 })

  useEffect(() => {
    if (isLoading) return
    if (!user || user.role !== 'admin') { navigate('/'); return }
    loadOrders()
  }, [user, isLoading])

  if (isLoading) return <div className="admin__loading">LOADING...</div>

  async function loadOrders() {
    const token = localStorage.getItem('maison_token')
    const res = await fetch(`${API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    setOrders(list)
    setStats({
      total: list.length,
      pending: list.filter(o => o.status === 'pending').length,
      pickup: list.filter(o => o.deliveryType === 'pickup').length,
      shipping: list.filter(o => o.deliveryType === 'shipping').length,
      revenue: list.filter(o => !['cancelled'].includes(o.status)).reduce((sum, o) => sum + o.total, 0)
    })
    setLoading(false)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <article className="admin">
      {/* HEADER */}
      <header className="admin__header">
        <div className="admin__header-content">
          <h1 className="admin__title">ADMIN DASHBOARD</h1>
          <p className="admin__subtitle">Maison Apple — Order Overview</p>
        </div>
        <button className="admin__logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {/* ANALYTICS SECTION */}
      <section className="admin__stats" aria-label="Order Statistics">
        <div className="admin__stat">
          <div className="admin__stat-value">{stats.total}</div>
          <div className="admin__stat-label">TOTAL ORDERS</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#d4a574' }}>{stats.pending}</div>
          <div className="admin__stat-label">PENDING (SHIPPING)</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#d4a574' }}>{stats.pickup}</div>
          <div className="admin__stat-label">PICKUP ORDERS</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#d4a574' }}>{stats.shipping}</div>
          <div className="admin__stat-label">SHIPPING ORDERS</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#d4a574' }}>${stats.revenue.toLocaleString()}</div>
          <div className="admin__stat-label">REVENUE</div>
        </div>
      </section>

      {/* ALL ORDERS LIST */}
      <section className="admin__orders-section" aria-label="All Orders">
        <h2 className="admin__section-title">ALL ORDERS</h2>
        {loading ? (
          <div className="admin__loading">LOADING...</div>
        ) : orders.length === 0 ? (
          <div className="admin__empty">NO ORDERS</div>
        ) : (
          <div className="admin__orders-grid">
            {orders.map(order => (
              <article key={order._id} className="admin__order-item">
                <header className="admin__order-item-header">
                  <div>
                    <span className="admin__order-item-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="admin__order-item-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="admin__delivery-badge" style={{ 
                      color: order.deliveryType === 'pickup' ? '#d4a574' : '#888',
                      fontSize: '10px'
                    }}>
                      {order.deliveryType.toUpperCase()}
                    </span>
                    <span className="admin__status-badge" style={{ background: STATUS_COLORS[order.status] }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </header>
                <div className="admin__order-item-customer">{order.user?.name}</div>
                <div className="admin__order-item-total">${order.total?.toLocaleString()}</div>
              </article>
            ))}
          </div>
        )}
      </section>
    </article>
  )
}