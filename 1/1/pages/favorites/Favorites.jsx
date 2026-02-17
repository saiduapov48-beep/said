import { Link } from 'react-router-dom'
import products from '../../data/products.js'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import './Favorites.css'

export default function Favorites() {
  const { favorites } = useFavorites()
  const favProducts = products.filter((p) => favorites.includes(p.id))

  return (
    <div className="favorites">
      <div className="favorites__header">
        <h1 className="favorites__title">FAVORITES</h1>
        <div className="favorites__count">{favProducts.length} SAVED DEVICES</div>
      </div>

      {favProducts.length > 0 ? (
        <div className="favorites__grid">
          {favProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
