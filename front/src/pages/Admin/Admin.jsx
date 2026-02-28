import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const API = 'http://localhost:5000/api'

const SHIPPING_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const PICKUP_STATUSES = ['pending', 'confirmed', 'ready', 'completed', 'cancelled']
const ALL_STATUSES = ['pending', 'confirmed', 'ready', 'shipped', 'delivered', 'completed', 'cancelled']

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  ready: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  completed: '#10b981',
  cancelled: '#ef4444'
}

export default function Admin() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupError, setLookupError] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('orders')
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

  async function changeStatus(orderId, status) {
    const token = localStorage.getItem('maison_token')
    await fetch(`${API}/orders/admin/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    loadOrders()
  }

  async function handleLookup() {
    setLookupError('')
    setLookupResult(null)
    if (!lookupQuery.trim()) return
    const token = localStorage.getItem('maison_token')
    const res = await fetch(`${API}/orders/admin/lookup?query=${encodeURIComponent(lookupQuery)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) { setLookupError('No pickup order found for this customer'); return }
    const data = await res.json()
    setLookupResult(data)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const pickupOrders = orders.filter(o => o.deliveryType === 'pickup' && !['completed', 'cancelled'].includes(o.status))

  return (
    <div className="admin">
      {/* HEADER */}
      <div className="admin__header">
        <div>
          <h1 className="admin__title">ADMIN PANEL</h1>
          <p className="admin__subtitle">Maison Apple — Order Management</p>
        </div>
      </div>

      {/* STATS */}
      <div className="admin__stats">
        <div className="admin__stat">
          <div className="admin__stat-value">{stats.total}</div>
          <div className="admin__stat-label">TOTAL ORDERS</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#f59e0b' }}>{stats.pending}</div>
          <div className="admin__stat-label">PENDING</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#4af' }}>{stats.pickup}</div>
          <div className="admin__stat-label">PICKUP</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#fa4' }}>{stats.shipping}</div>
          <div className="admin__stat-label">SHIPPING</div>
        </div>
        <div className="admin__stat">
          <div className="admin__stat-value" style={{ color: '#10b981' }}>${stats.revenue.toLocaleString()}</div>
          <div className="admin__stat-label">REVENUE</div>
        </div>
      </div>

      {/* TABS */}
      <div className="admin__tabs">
        <button className={`admin__tab${activeTab === 'orders' ? ' admin__tab--active' : ''}`} onClick={() => setActiveTab('orders')}>
          ALL ORDERS ({orders.length})
        </button>
        <button className={`admin__tab${activeTab === 'pickup' ? ' admin__tab--active' : ''}`} onClick={() => setActiveTab('pickup')}>
           PICKUP IN STORE ({pickupOrders.length})
        </button>
      </div>

      {/* PICKUP TAB */}
      {activeTab === 'pickup' && (
        <div className="admin__pickup">
          <div className="admin__lookup">
            <h2 className="admin__lookup-title">CUSTOMER IDENTIFICATION</h2>
            <p className="admin__lookup-desc">Enter customer email or order ID to verify and complete pickup</p>
            <div className="admin__lookup-row">
              <input
                className="admin__lookup-input"
                placeholder="Email or Order ID..."
                value={lookupQuery}
                onChange={e => setLookupQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
              />
              <button className="admin__lookup-btn" onClick={handleLookup}>FIND ORDER</button>
            </div>
            {lookupError && <div className="admin__lookup-error">{lookupError}</div>}
            {lookupResult && (
              <div className="admin__lookup-result">
                <div className="admin__lookup-result-header">
                  <span>ORDER #{lookupResult._id.slice(-6).toUpperCase()}</span>
                  <span className="admin__status-badge" style={{ background: STATUS_COLORS[lookupResult.status] }}>
                    {lookupResult.status.toUpperCase()}
                  </span>
                </div>
                <div className="admin__lookup-grid">
                  <div><span className="admin__lookup-key">Customer</span><span>{lookupResult.user?.name}</span></div>
                  <div><span className="admin__lookup-key">Email</span><span>{lookupResult.user?.email}</span></div>
                  <div><span className="admin__lookup-key">Store</span><span>{lookupResult.pickup?.storeName}</span></div>
                  <div><span className="admin__lookup-key">Address</span><span>{lookupResult.pickup?.storeAddress}</span></div>
                  <div><span className="admin__lookup-key">Items</span><span>{lookupResult.items?.map(i => `${i.product?.name} ×${i.quantity}`).join(', ')}</span></div>
                  <div><span className="admin__lookup-key">Total</span><span>${lookupResult.total?.toLocaleString()}</span></div>
                </div>
                {lookupResult.status !== 'completed' && lookupResult.status !== 'cancelled' && (
                  <button
                    className="admin__complete-btn"
                    onClick={() => { changeStatus(lookupResult._id, 'completed'); setLookupResult({ ...lookupResult, status: 'completed' }) }}
                  >
                    ✓ COMPLETE PICKUP — HAND OVER TO CUSTOMER
                  </button>
                )}
                {lookupResult.status === 'completed' && (
                  <div className="admin__completed-msg">✓ ORDER COMPLETED — HANDED OVER</div>
                )}
              </div>
            )}
          </div>

          {/* PENDING PICKUPS */}
          <h2 style={{ marginBottom: '1rem' }}>PENDING PICKUPS</h2>
          {pickupOrders.length === 0 ? (
            <div className="admin__empty">NO PENDING PICKUPS</div>
          ) : (
            pickupOrders.map(order => (
              <div key={order._id} className="admin__order-card">
                <div className="admin__order-top">
                  <div>
                    <span className="admin__order-id">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className="admin__order-date">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="admin__status-badge" style={{ background: STATUS_COLORS[order.status] }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="admin__order-customer">{order.user?.name} · {order.user?.email}</div>
                <div className="admin__order-store"> {order.pickup?.storeName} — {order.pickup?.storeAddress}</div>
                <div className="admin__order-items">{order.items?.map(i => `${i.product?.name} ×${i.quantity}`).join(', ')}</div>
                <div className="admin__order-total">${order.total?.toLocaleString()}</div>
                <select
                  className="admin__status-select"
                  value={order.status}
                  onChange={e => changeStatus(order._id, e.target.value)}
                >
                  {PICKUP_STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>
            ))
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          {/* FILTER */}
          <div className="admin__filters">
            <button className={`admin__filter-btn${filter === 'all' ? ' admin__filter-btn--active' : ''}`} onClick={() => setFilter('all')}>
              ALL ({orders.length})
            </button>
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                className={`admin__filter-btn${filter === s ? ' admin__filter-btn--active' : ''}`}
                onClick={() => setFilter(s)}
                style={{ borderColor: STATUS_COLORS[s] }}
              >
                <span style={{ color: STATUS_COLORS[s] }}>●</span> {s.toUpperCase()} ({orders.filter(o => o.status === s).length})
              </button>
            ))}
          </div>

          {loading ? <div className="admin__loading">LOADING...</div> : (
            <div>
              {filtered.map(order => (
                <div key={order._id} className="admin__order-card">
                  <div className="admin__order-top">
                    <div>
                      <span className="admin__order-id">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className="admin__order-date">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="admin__delivery-badge" style={{ color: order.deliveryType === 'pickup' ? '#4af' : '#fa4' }}>
                        {order.deliveryType === 'pickup' ? 'PICKUP' : 'SHIPPING'}
                      </span>
                      <span className="admin__status-badge" style={{ background: STATUS_COLORS[order.status] }}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="admin__order-customer">{order.user?.name} · {order.user?.email}</div>
                  <div className="admin__order-store">
                    {order.deliveryType === 'pickup'
                      ? `${order.pickup?.storeName} — ${order.pickup?.storeAddress}`
                      : `${order.shipping?.address}, ${order.shipping?.city}, ${order.shipping?.country}`
                    }
                  </div>
                  <div className="admin__order-items">{order.items?.map(i => `${i.product?.name} ×${i.quantity}`).join(', ')}</div>
                  <div className="admin__order-total">${order.total?.toLocaleString()}</div>
                  <select
                    className="admin__status-select"
                    value={order.status}
                    onChange={e => changeStatus(order._id, e.target.value)}
                  >
                    {(order.deliveryType === 'pickup' ? PICKUP_STATUSES : SHIPPING_STATUSES).map(s => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              ))}
              {filtered.length === 0 && <div className="admin__empty">NO ORDERS</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}