import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch.js'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import './Catalog.css'

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => setProducts(data))
  }, [])

  const {
    query, setQuery,
    category, setCategory,
    sortBy, setSortBy,
    showInStockOnly, setShowInStockOnly,
    filtered, filteredCount, totalCount
  } = useSearch(products)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
  }, [searchParams, setCategory])

  return (
    <div className="catalog">
      <div className="catalog__header">
        <h1 className="catalog__title">CATALOG</h1>
        <div className="catalog__count">
          SHOWING {filteredCount} OF {totalCount} DEVICES
        </div>
      </div>

      <div className="catalog__filters">
        <input
          className="catalog__search"
          type="text"
          placeholder="SEARCH DEVICES..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search devices"
        />
        <select
          className="catalog__select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">ALL CATEGORIES</option>
          <option value="iphone">IPHONE</option>
          <option value="macbook">MACBOOK</option>
          <option value="ipad">IPAD</option>
          <option value="accessories">ACCESSORIES</option>
        </select>
        <select
          className="catalog__select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort by"
        >
          <option value="default">DEFAULT SORT</option>
          <option value="price-asc">PRICE: LOW TO HIGH</option>
          <option value="price-desc">PRICE: HIGH TO LOW</option>
          <option value="name-asc">NAME: A-Z</option>
          <option value="name-desc">NAME: Z-A</option>
        </select>
        <label className="catalog__checkbox-label">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
          />
          IN STOCK ONLY
        </label>
      </div>

      <div className="catalog__grid">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="catalog__empty">
            <div className="catalog__empty-title">NO DEVICES FOUND</div>
            <div className="catalog__empty-text">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  )
}