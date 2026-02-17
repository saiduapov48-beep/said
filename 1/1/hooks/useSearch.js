import { useState, useMemo } from 'react'

export default function useSearch(items) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = [...items]

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    }

    if (category !== 'all') {
      result = result.filter((item) => item.category === category)
    }

    if (showInStockOnly) {
      result = result.filter((item) => item.inStock)
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    return result
  }, [items, query, category, sortBy, showInStockOnly])

  return {
    query,
    setQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    showInStockOnly,
    setShowInStockOnly,
    filtered,
    totalCount: items.length,
    filteredCount: filtered.length
  }
}
