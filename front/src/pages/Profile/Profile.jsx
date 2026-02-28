import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Profile.css'

const API = 'http://localhost:5000/api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('maison_token')
    fetch(`${API}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="profile">
      <div className="profile__header">
        <h1 className="profile__title">{user.name}</h1>
        <span className="profile__role">{user.role}</span>
      </div>

      <div className="profile__section">
        <h2 className="profile__section-title">ACCOUNT INFORMATION</h2>
        <div className="profile__info-grid">
          <div className="profile__info-item">
            <div className="profile__info-label">NAME</div>
            <div className="profile__info-value">{user.name}</div>
          </div>
          <div className="profile__info-item">
            <div className="profile__info-label">EMAIL</div>
            <div className="profile__info-value">{user.email}</div>
          </div>
          <div className="profile__info-item">
            <div className="profile__info-label">ROLE</div>
            <div className="profile__info-value">{user.role.toUpperCase()}</div>
          </div>
          <div className="profile__info-item">
            <div className="profile__info-label">MEMBER SINCE</div>
            <div className="profile__info-value">
              {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <div className="profile__section">
        <h2 className="profile__section-title">MY ORDERS ({orders.length})</h2>
        {loading ? (
          <div className="profile__empty">LOADING...</div>
        ) : orders.length > 0 ? (
          orders.map(order => (
            <div key={order._id} className="profile__booking">
              <div>
                <div className="profile__booking-name">
                  ORDER #{order._id.slice(-6).toUpperCase()}
                </div>
                <div className="profile__booking-date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="profile__booking-date">
                  {order.deliveryType === 'pickup'
                    ? `PICKUP: ${order.pickup?.storeName}, ${order.pickup?.storeAddress}`
                    : `SHIPPING TO: ${order.shipping?.address}, ${order.shipping?.city}`
                  }
                </div>
                <div className="profile__booking-date">
                  {order.items.length} item(s) · ${order.total.toLocaleString()}
                </div>
              </div>
              <div className={`profile__status profile__status--${order.status}`}>
                {order.status.toUpperCase()}
              </div>
            </div>
          ))
        ) : (
          <div className="profile__empty">NO ORDERS YET</div>
        )}
      </div>

      <button className="profile__logout" onClick={handleLogout}>
        SIGN OUT
      </button>
    </div>
  )
}