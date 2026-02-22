import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import products from '../../data/products.js'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import BookingModal from '../../components/BookingModal/BookingModal.jsx'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const { toggleFavorite, isFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  if (!product) {
    return (
      <div className="detail__not-found">
        <h2>DEVICE NOT FOUND</h2>
        <p>The device you are looking for does not exist.</p>
        <Link to="/catalog" className="detail__back" style={{ display: 'inline-block', width: 'auto', border: 'none', marginTop: 24 }}>
          {'<'} BACK TO CATALOG
        </Link>
      </div>
    )
  }

  const fav = isFavorite(product.id)

  return (
    <div className="detail">
      <Link to="/catalog" className="detail__back">{'<'} BACK TO CATALOG</Link>

      <div className="detail__content">
        <div className="detail__image-wrapper">
          <img
            className="detail__image"
            src={product.image}
            alt={product.name}
            crossOrigin="anonymous"
          />
        </div>

        <div className="detail__info">
          <span className="detail__category">{product.category}</span>
          <h1 className="detail__name">{product.name}</h1>
          <div className="detail__price">{'$'}{product.price.toLocaleString()}</div>

          <div className={`detail__stock${product.inStock ? ' detail__stock--in' : ' detail__stock--out'}`}>
            {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
          </div>

          <p className="detail__description">{product.description}</p>

          <div className="detail__color">
            COLOR:<span>{product.color}</span>
          </div>

          <div className="detail__specs">
            <div className="detail__specs-title">SPECIFICATIONS</div>
            {product.specs.map((spec, i) => (
              <div key={i} className="detail__spec-item">{spec}</div>
            ))}
          </div>

          <div className="detail__actions">
            <button
              className="detail__btn detail__btn--primary"
              disabled={!product.inStock}
              onClick={() => setModalOpen(true)}
            >
              {product.inStock ? 'RESERVE NOW' : 'UNAVAILABLE'}
            </button>
            {isAuthenticated && (
              <button
                className="detail__btn detail__btn--secondary"
                onClick={() => toggleFavorite(product.id)}
              >
                {fav ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}
              </button>
            )}
          </div>
        </div>
      </div>

      <BookingModal product={product} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
