import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Checkout.css'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    notes: ''
  })

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      navigate('/cart')
    }
  }, [items, submitted, navigate])

  function validate() {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email'
    if (!formData.phone.trim()) errs.phone = 'Phone is required'
    if (!formData.address.trim()) errs.address = 'Address is required'
    if (!formData.city.trim()) errs.city = 'City is required'
    if (!formData.zip.trim()) errs.zip = 'ZIP code is required'
    if (!formData.country.trim()) errs.country = 'Country is required'
    // Карта
    if (!cardData.cardNumber.trim()) errs.cardNumber = 'Card number is required'
    else if (cardData.cardNumber.replace(/\s/g, '').length !== 16) errs.cardNumber = 'Invalid card number'
    if (!cardData.cardName.trim()) errs.cardName = 'Name on card is required'
    if (!cardData.cardExpiry.trim()) errs.cardExpiry = 'Expiry date is required'
    else if (!/^\d{2}\/\d{2}$/.test(cardData.cardExpiry)) errs.cardExpiry = 'Format: MM/YY'
    if (!cardData.cardCvv.trim()) errs.cardCvv = 'CVV is required'
    else if (!/^\d{3,4}$/.test(cardData.cardCvv)) errs.cardCvv = 'Invalid CVV'
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleCardChange(e) {
    let { name, value } = e.target

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16)
      value = value.replace(/(.{4})/g, '$1 ').trim()
    }
    if (name === 'cardExpiry') {
      value = value.replace(/\D/g, '').slice(0, 4)
      if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2)
    }
    if (name === 'cardCvv') {
      value = value.replace(/\D/g, '').slice(0, 4)
    }

    setCardData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    try {
      const token = localStorage.getItem('maison_token')
      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(i => ({
            product: i.product._id,
            quantity: i.quantity,
            price: i.product.price
          })),
          total,
          shipping: formData
        })
      })
      await clearCart()
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
  }

  if (submitted) {
    return (
      <div className="checkout">
        <div className="checkout__success">
          <div className="checkout__success-icon">✓</div>
          <h1 className="checkout__success-title">ORDER CONFIRMED</h1>
          <p className="checkout__success-text">
            Thank you, {formData.name}! Your order has been placed successfully.
            We will contact you at {formData.email} with delivery details.
          </p>
          <button className="checkout__success-btn" onClick={() => navigate('/catalog')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="checkout__header">
        <h1 className="checkout__title">CHECKOUT</h1>
      </div>

      <div className="checkout__content">
        <form className="checkout__form" onSubmit={handleSubmit} noValidate>

          <div className="checkout__section">
            <h2 className="checkout__section-title">CONTACT INFORMATION</h2>
            <div className="checkout__grid">
              <div className="checkout__field">
                <label className="checkout__label">FULL NAME</label>
                <input
                  className={`checkout__input${errors.name ? ' checkout__input--error' : ''}`}
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Your full name"
                />
                {errors.name && <div className="checkout__error">{errors.name}</div>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">EMAIL</label>
                <input
                  className={`checkout__input${errors.email ? ' checkout__input--error' : ''}`}
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="your@email.com"
                />
                {errors.email && <div className="checkout__error">{errors.email}</div>}
              </div>
              <div className="checkout__field checkout__field--full">
                <label className="checkout__label">PHONE</label>
                <input
                  className={`checkout__input${errors.phone ? ' checkout__input--error' : ''}`}
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="+1 234 567 8900"
                />
                {errors.phone && <div className="checkout__error">{errors.phone}</div>}
              </div>
            </div>
          </div>

          <div className="checkout__section">
            <h2 className="checkout__section-title">DELIVERY ADDRESS</h2>
            <div className="checkout__grid">
              <div className="checkout__field checkout__field--full">
                <label className="checkout__label">ADDRESS</label>
                <input
                  className={`checkout__input${errors.address ? ' checkout__input--error' : ''}`}
                  type="text" name="address" value={formData.address}
                  onChange={handleChange} placeholder="Street address, apt, suite..."
                />
                {errors.address && <div className="checkout__error">{errors.address}</div>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">CITY</label>
                <input
                  className={`checkout__input${errors.city ? ' checkout__input--error' : ''}`}
                  type="text" name="city" value={formData.city}
                  onChange={handleChange} placeholder="City"
                />
                {errors.city && <div className="checkout__error">{errors.city}</div>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">ZIP CODE</label>
                <input
                  className={`checkout__input${errors.zip ? ' checkout__input--error' : ''}`}
                  type="text" name="zip" value={formData.zip}
                  onChange={handleChange} placeholder="12345"
                />
                {errors.zip && <div className="checkout__error">{errors.zip}</div>}
              </div>
              <div className="checkout__field checkout__field--full">
                <label className="checkout__label">COUNTRY</label>
                <input
                  className={`checkout__input${errors.country ? ' checkout__input--error' : ''}`}
                  type="text" name="country" value={formData.country}
                  onChange={handleChange} placeholder="Country"
                />
                {errors.country && <div className="checkout__error">{errors.country}</div>}
              </div>
              <div className="checkout__field checkout__field--full">
                <label className="checkout__label">ORDER NOTES (OPTIONAL)</label>
                <textarea
                  className="checkout__input checkout__textarea"
                  name="notes" value={formData.notes}
                  onChange={handleChange} placeholder="Special delivery instructions..." rows={3}
                />
              </div>
            </div>
          </div>

          <div className="checkout__section">
            <h2 className="checkout__section-title">PAYMENT</h2>
              <div className="checkout__card-icons">
                <img src="/images/payment/visa.svg" alt="Visa" />
                <img src="/images/payment/mastercard.svg" alt="Mastercard" />
              </div>
            <div className="checkout__grid">
              <div className="checkout__field checkout__field--full">
                <label className="checkout__label">CARD NUMBER</label>
                <input
                  className={`checkout__input checkout__input--card${errors.cardNumber ? ' checkout__input--error' : ''}`}
                  type="text" name="cardNumber" value={cardData.cardNumber}
                  onChange={handleCardChange} placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
                {errors.cardNumber && <div className="checkout__error">{errors.cardNumber}</div>}
              </div>
              <div className="checkout__field checkout__field--full">
                <label className="checkout__label">NAME ON CARD</label>
                <input
                  className={`checkout__input${errors.cardName ? ' checkout__input--error' : ''}`}
                  type="text" name="cardName" value={cardData.cardName}
                  onChange={handleCardChange} placeholder="DOBI POPI"
                />
                {errors.cardName && <div className="checkout__error">{errors.cardName}</div>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">EXPIRY DATE</label>
                <input
                  className={`checkout__input${errors.cardExpiry ? ' checkout__input--error' : ''}`}
                  type="text" name="cardExpiry" value={cardData.cardExpiry}
                  onChange={handleCardChange} placeholder="MM/YY" maxLength={5}
                />
                {errors.cardExpiry && <div className="checkout__error">{errors.cardExpiry}</div>}
              </div>
              <div className="checkout__field">
                <label className="checkout__label">CVV</label>
                <input
                  className={`checkout__input${errors.cardCvv ? ' checkout__input--error' : ''}`}
                  type="password" name="cardCvv" value={cardData.cardCvv}
                  onChange={handleCardChange} placeholder="•••" maxLength={4}
                />
                {errors.cardCvv && <div className="checkout__error">{errors.cardCvv}</div>}
              </div>
            </div>
          </div>

          <button type="submit" className="checkout__submit">PLACE ORDER</button>
        </form>

        <div className="checkout__summary">
          <h2 className="checkout__summary-title">ORDER SUMMARY</h2>
          <div className="checkout__summary-items">
            {items.map(item => (
              <div key={item.product._id} className="checkout__summary-item">
                <img src={item.product.image} alt={item.product.name}
                  className="checkout__summary-img" crossOrigin="anonymous" />
                <div className="checkout__summary-info">
                  <div className="checkout__summary-name">{item.product.name}</div>
                  <div className="checkout__summary-qty">QTY: {item.quantity}</div>
                </div>
                <div className="checkout__summary-price">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="checkout__summary-row">
            <span>SUBTOTAL</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="checkout__summary-row">
            <span>SHIPPING</span>
            <span>FREE</span>
          </div>
          <div className="checkout__summary-total">
            <span>TOTAL</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}