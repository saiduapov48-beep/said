import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import './Cart.css'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="cart">
        <div className="cart__header">
          <h1 className="cart__title">CART</h1>
        </div>
        <div className="cart__empty">
          <div className="cart__empty-title">YOUR CART IS EMPTY</div>
          <div className="cart__empty-text">Browse the catalog and add devices to your cart</div>
          <Link to="/catalog" className="cart__empty-link">EXPLORE CATALOG</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="cart__header">
        <h1 className="cart__title">CART</h1>
        <button className="cart__clear" onClick={clearCart}>CLEAR ALL</button>
      </div>

      <div className="cart__content">
        <div className="cart__items">
          {items.map((item) => (
            <div key={item.product._id} className="cart__item">
              <img
                className="cart__item-image"
                src={item.product.image}
                alt={item.product.name}
                crossOrigin="anonymous"
              />
              <div className="cart__item-info">
                <span className="cart__item-category">{item.product.category}</span>
                <h3 className="cart__item-name">{item.product.name}</h3>
                <div className="cart__item-price">${item.product.price.toLocaleString()}</div>
              </div>
              <div className="cart__item-controls">
                <button
                  className="cart__qty-btn"
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                >−</button>
                <span className="cart__qty">{item.quantity}</span>
                <button
                  className="cart__qty-btn"
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                >+</button>
              </div>
              <div className="cart__item-total">
                ${(item.product.price * item.quantity).toLocaleString()}
              </div>
              <button
                className="cart__item-remove"
                onClick={() => removeFromCart(item.product._id)}
              >✕</button>
            </div>
          ))}
        </div>

        <div className="cart__summary">
          <h2 className="cart__summary-title">ORDER SUMMARY</h2>
          <div className="cart__summary-row">
            <span>SUBTOTAL</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="cart__summary-row">
            <span>SHIPPING</span>
            <span>FREE</span>
          </div>
          <div className="cart__summary-row cart__summary-total">
            <span>TOTAL</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button className="cart__checkout" onClick={() => navigate('/checkout')}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  )
}