import { Link } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const fav = isFavorite(product._id)

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
          crossOrigin="anonymous"
          loading="lazy"
        />
        {isAuthenticated && (
          <button
            className={`product-card__fav-btn${fav ? ' product-card__fav-btn--active' : ''}`}
            onClick={() => toggleFavorite(product._id)}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '♥' : '♡'}
          </button>
        )}
        {!product.inStock && (
          <span className="product-card__stock-badge product-card__stock-badge--out">
            OUT OF STOCK
          </span>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price">${product.price.toLocaleString()}</div>
        {isAuthenticated && (
          <button
            className="product-card__cart-btn"
            onClick={() => addToCart(product._id)}
            disabled={!product.inStock}
          >
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
        )}
        <Link to={`/product/${product._id}`} className="product-card__link">
          VIEW DETAILS
        </Link>
      </div>
    </article>
  )
}