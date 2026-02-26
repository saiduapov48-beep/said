import { useState, useMemo } from 'react'

export default function useSearch(products) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    if (category !== 'all') {
      result = result.filter(p => p.category === category)
    }

    if (showInStockOnly) {
      result = result.filter(p => p.inStock)
    }

    switch (sortBy) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'name-desc':  result.sort((a, b) => b.name.localeCompare(a.name)); break
      default: break
    }

    return result
  }, [products, query, category, sortBy, showInStockOnly])

  return {
    query, setQuery,
    category, setCategory,
    sortBy, setSortBy,
    showInStockOnly, setShowInStockOnly,
    filtered,
    filteredCount: filtered.length,
    totalCount: products.length
  }
}