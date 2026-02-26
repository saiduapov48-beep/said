import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import './Favorites.css'

const API = 'http://localhost:5000/api/products'

export default function Favorites() {
  const { favorites } = useFavorites()
  const [favProducts, setFavProducts] = useState([])

  useEffect(() => {
    if (favorites.length === 0) {
      setFavProducts([])
      return
    }
    // Грузим все продукты и фильтруем по избранному
    fetch(API)
      .then(r => r.json())
      .then(all => setFavProducts(all.filter(p => favorites.includes(p._id))))
      .catch(() => setFavProducts([]))
  }, [favorites])

  return (
    <div className="favorites">
      <div className="favorites__header">
        <h1 className="favorites__title">FAVORITES</h1>
        <div className="favorites__count">{favProducts.length} SAVED DEVICES</div>
      </div>

      {favProducts.length > 0 ? (
        <div className="favorites__grid">
          {favProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="favorites__empty">
          <div className="favorites__empty-title">NO FAVORITES YET</div>
          <div className="favorites__empty-text">
            Browse the catalog and add devices to your favorites
          </div>
          <Link to="/catalog" className="favorites__empty-link">EXPLORE CATALOG</Link>
        </div>
      )}
    </div>
  )
}