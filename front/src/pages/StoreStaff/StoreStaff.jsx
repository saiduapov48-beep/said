import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import './StoreStaff.css'

const API = 'http://localhost:5000/api'
const PICKUP_STATUSES = ['accepting', 'ready', 'completed', 'cancelled']

export default function StoreStaff() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('accepting')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    if (isLoading) return
if (!user || user.role !== 'store_staff') { navigate('/'); return }
    loadOrders()
  }, [user, isLoading])

  if (isLoading) return <div className="staff__loading">LOADING...</div>

  async function loadOrders() {
    const token = localStorage.getItem('maison_token')
    const res = await fetch(`${API}/orders/staff/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    // Только PICKUP заказы
    setOrders(list.filter(o => o.deliveryType === 'pickup'))
    setLoading(false)
  }

  async function changeStatus(orderId, status) {
    const token = localStorage.getItem('maison_token')
    await fetch(`${API}/orders/staff/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder({ ...selectedOrder, status })
    }
    loadOrders()
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const filtered = filter === 'all' 
    ? orders
    : orders.filter(o => o.status === filter)

  return (
    <article className="staff">
      <header className="staff__header">
        <div className="staff__header-content">
          <h1 className="staff__title">STORE STAFF</h1>
          <p className="staff__subtitle">Pickup Order Management</p>
        </div>
        <button className="staff__logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {/* FILTERS */}
      <nav className="staff__filters">
        {PICKUP_STATUSES.map(s => (
          <button
            key={s}
            className={`staff__filter-btn${filter === s ? ' staff__filter-btn--active' : ''}`}
            onClick={() => setFilter(s)}
          >
            ● {s.toUpperCase()} ({orders.filter(o => o.status === s).length})
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <div className="staff__content">
        {/* ORDERS LIST */}
        <section className="staff__orders-list">
          {loading ? (
            <div className="staff__loading">LOADING...</div>
          ) : filtered.length === 0 ? (
            <div className="staff__empty">NO ORDERS</div>
          ) : (
            <div className="staff__orders">
              {filtered.map(order => (
                <button
                  key={order._id}
                  className={`staff__order-card${selectedOrder?._id === order._id ? ' staff__order-card--active' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="staff__order-id">#{order._id.slice(-8).toUpperCase()}</div>
                  <div className="staff__order-customer">{order.user?.name}</div>
                  <div className={`staff__order-status staff__order-status--${order.status}`}>
                    {order.status.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ORDER DETAILS */}
        {selectedOrder && (
          <section className="staff__details">
            <div className="staff__detail-header">
              <h2 className="staff__detail-id">#{selectedOrder._id.slice(-8).toUpperCase()}</h2>
              <div className="staff__detail-date">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
            </div>

            <div className="staff__detail-info">
              <div className="staff__detail-row">
                <span className="staff__detail-label">CUSTOMER</span>
                <span>{selectedOrder.user?.name}</span>
              </div>
              <div className="staff__detail-row">
                <span className="staff__detail-label">EMAIL</span>
                <span>{selectedOrder.user?.email}</span>
              </div>
              <div className="staff__detail-row">
                <span className="staff__detail-label">STORE</span>
                <span>{selectedOrder.pickup?.storeName}</span>
              </div>
              <div className="staff__detail-row">
                <span className="staff__detail-label">ADDRESS</span>
                <span>{selectedOrder.pickup?.storeAddress}</span>
              </div>
            </div>

            <div className="staff__detail-items">
              <span className="staff__detail-label">ITEMS</span>
              <div className="staff__items-list">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="staff__item">
                    {item.product?.name} <span style={{ color: '#888' }}>×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="staff__detail-total">
              <span className="staff__detail-label">TOTAL</span>
              <span>${selectedOrder.total?.toLocaleString()}</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="staff__actions">
              {selectedOrder.status === 'accepting' && (
                <button
                  className="staff__action-btn staff__action-btn--primary"
                  onClick={() => changeStatus(selectedOrder._id, 'ready')}
                >
                  READY & CONFIRM
                </button>
              )}
              {selectedOrder.status === 'ready' && (
                <button
                  className="staff__action-btn staff__action-btn--success"
                  onClick={() => changeStatus(selectedOrder._id, 'completed')}
                >
                  CONFIRM & COMPLETED
                </button>
              )}
              {selectedOrder.status === 'completed' && (
                <div className="staff__completed">✓ COMPLETED</div>
              )}
              {selectedOrder.status === 'cancelled' && (
                <div className="staff__cancelled">✗ CANCELLED</div>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
