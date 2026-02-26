import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import './Home.css'

const API = 'http://localhost:5000/api/products'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
  }, [])

  const featured = products.filter((p) => p.inStock).slice(0, 4)

  return (
    <>
      <section className="hero">
        <span className="hero__label">RESERVATION SYSTEM</span>
        <h1 className="hero__title">THE ART OF TECHNOLOGY</h1>
        <p className="hero__subtitle">
          A curated selection of Apple devices, presented with the precision
          and restraint of high fashion. Reserve your piece of the future.
        </p>
        <div className="hero__actions">
          <Link to="/catalog" className="hero__btn hero__btn--primary">EXPLORE CATALOG</Link>
          <Link to="/about" className="hero__btn hero__btn--secondary">OUR PHILOSOPHY</Link>
        </div>
      </section>

      <section className="featured" aria-label="Featured products">
        <div className="featured__header">
          <h2 className="featured__title">FEATURED DEVICES</h2>
          <Link to="/catalog" className="featured__view-all">VIEW ALL</Link>
        </div>
        <div className="featured__grid">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="stats" aria-label="Statistics">
        <div className="stats__inner">
          <div className="stats__item">
            <div className="stats__number">{products.length}</div>
            <div className="stats__label">DEVICES</div>
          </div>
          <div className="stats__item">
            <div className="stats__number">4</div>
            <div className="stats__label">CATEGORIES</div>
          </div>
          <div className="stats__item">
            <div className="stats__number">24/7</div>
            <div className="stats__label">SUPPORT</div>
          </div>
          <div className="stats__item">
            <div className="stats__number">100%</div>
            <div className="stats__label">AUTHENTIC</div>
          </div>
        </div>
      </section>
    </>
  )
}