import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import './CourierStaff.css'

const API = 'http://localhost:5000/api'
const COURIER_STATUSES = ['ready_to_ship', 'delivering', 'completed', 'cancelled']

export default function CourierStaff() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ready_to_ship')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    if (isLoading) return
    if (!user || user.role !== 'courier') { navigate('/'); return }
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
    // Только SHIPPING заказы со статусом ready_to_ship, delivering, completed
    setOrders(list.filter(o =>
      o.deliveryType === 'shipping' &&
      ['ready_to_ship', 'delivering', 'completed'].includes(o.status)
    ))
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
          <h1 className="staff__title">DELIVERY COURIER</h1>
          <p className="staff__subtitle">In-Transit Order Delivery</p>
        </div>
        <button className="staff__logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {/* FILTERS */}
      <nav className="staff__filters">
        {COURIER_STATUSES.map(s => (
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
                <span className="staff__detail-label">CUSTOMER NAME</span>
                <span>{selectedOrder.user?.name}</span>
              </div>
              <div className="staff__detail-row">
                <span className="staff__detail-label">PHONE</span>
                <span>{selectedOrder.user?.phone || '—'}</span>
              </div>
              <div className="staff__detail-row">
                <span className="staff__detail-label">DELIVERY ADDRESS</span>
                <span>{selectedOrder.shipping?.address}</span>
              </div>
              <div className="staff__detail-row">
                <span className="staff__detail-label">CITY</span>
                <span>{selectedOrder.shipping?.city}</span>
              </div>
              <div className="staff__detail-row">
                <span className="staff__detail-label">POSTAL CODE</span>
                <span>{selectedOrder.shipping?.postalCode || '—'}</span>
              </div>
            </div>

            <div className="staff__detail-items">
              <span className="staff__detail-label">ITEMS TO DELIVER</span>
              <div className="staff__items-list">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="staff__item">
                    {item.product?.name} <span style={{ color: '#888' }}>×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="staff__detail-total">
              <span className="staff__detail-label">ORDER VALUE</span>
              <span>${selectedOrder.total?.toLocaleString()}</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="staff__actions">
              {selectedOrder.status === 'ready_to_ship' && (
                <button
                  className="staff__action-btn staff__action-btn--primary"
                  onClick={() => changeStatus(selectedOrder._id, 'delivering')}
                >
                  ACCEPT & START DELIVERING
                </button>
              )}
              {selectedOrder.status === 'delivering' && (
                <button
                  className="staff__action-btn staff__action-btn--success"
                  onClick={() => changeStatus(selectedOrder._id, 'completed')}
                >
                  CONFIRM DELIVERED TO CLIENT
                </button>
              )}
              {selectedOrder.status === 'completed' && (
                <div className="staff__completed">✓ COMPLETED — DELIVERED TO CLIENT</div>
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