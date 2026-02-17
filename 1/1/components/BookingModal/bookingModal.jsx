import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './BookingModal.css'

export default function BookingModal({ product, isOpen, onClose }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', date: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setFormData((prev) => ({ ...prev, name: user.name || '', email: user.email || '' }))
    }
    if (!isOpen) {
      setSubmitted(false)
      setErrors({})
    }
  }, [user, isOpen])

  function validate() {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email'
    if (!formData.date) errs.date = 'Date is required'
    else if (new Date(formData.date) <= new Date()) errs.date = 'Date must be in the future'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const booking = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      ...formData,
      createdAt: new Date().toISOString()
    }
    const bookings = JSON.parse(localStorage.getItem('maison_bookings') || '[]')
    bookings.push(booking)
    localStorage.setItem('maison_bookings', JSON.stringify(bookings))
    setSubmitted(true)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Book device">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">RESERVE DEVICE</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">{'\u2715'}</button>
        </div>

        {submitted ? (
          <div className="modal__success">
            <div className="modal__success-icon">{'\u2713'}</div>
            <div className="modal__success-title">RESERVATION CONFIRMED</div>
            <p className="modal__success-text">
              Your reservation for {product.name} has been submitted.
              We will contact you at {formData.email} to confirm details.
            </p>
            <div className="modal__footer" style={{ padding: '24px 0 0', justifyContent: 'center' }}>
              <button className="modal__btn modal__btn--primary" onClick={onClose} style={{ maxWidth: 200 }}>
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal__body">
              <div className="modal__field">
                <label className="modal__label" htmlFor="booking-name">FULL NAME</label>
                <input
                  id="booking-name"
                  className={`modal__input${errors.name ? ' modal__input--error' : ''}`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                {errors.name && <div className="modal__error">{errors.name}</div>}
              </div>
              <div className="modal__field">
                <label className="modal__label" htmlFor="booking-email">EMAIL</label>
                <input
                  id="booking-email"
                  className={`modal__input${errors.email ? ' modal__input--error' : ''}`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="modal__error">{errors.email}</div>}
              </div>
              <div className="modal__field">
                <label className="modal__label" htmlFor="booking-date">RESERVATION DATE</label>
                <input
                  id="booking-date"
                  className={`modal__input${errors.date ? ' modal__input--error' : ''}`}
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <div className="modal__error">{errors.date}</div>}
              </div>
              <div className="modal__field">
                <label className="modal__label" htmlFor="booking-notes">NOTES (OPTIONAL)</label>
                <input
                  id="booking-notes"
                  className="modal__input"
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Color preference, configuration..."
                />
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>CANCEL</button>
              <button type="submit" className="modal__btn modal__btn--primary">CONFIRM</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
