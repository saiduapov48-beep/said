import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('maison_bookings') || '[]')
    const mine = all.filter((b) => b.email === user.email)
    setBookings(mine)
  }, [user.email])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function deleteBooking(id) {
    const all = JSON.parse(localStorage.getItem('maison_bookings') || '[]')
    const updated = all.filter((b) => b.id !== id)
    localStorage.setItem('maison_bookings', JSON.stringify(updated))
    setBookings((prev) => prev.filter((b) => b.id !== id))
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
        <h2 className="profile__section-title">MY RESERVATIONS ({bookings.length})</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="profile__booking">
              <div>
                <div className="profile__booking-name">{booking.productName}</div>
                <div className="profile__booking-date">
                  Reserved for {new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <button className="profile__booking-delete" onClick={() => deleteBooking(booking.id)}>
                CANCEL
              </button>
            </div>
          ))
        ) : (
          <div className="profile__empty">NO RESERVATIONS YET</div>
        )}
      </div>

      <button className="profile__logout" onClick={handleLogout}>
        SIGN OUT
      </button>
    </div>
  )
}
