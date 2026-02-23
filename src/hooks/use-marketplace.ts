"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useMarketplaceStore } from "../store/product"
import type { FilterState } from "../types/filters"

export function useMarketplace() {
  const { products } = useMarketplaceStore()
  
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedBrands: [],
    selectedPriceRange: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "default",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  // Set to multiple of 4 to ensure complete rows (4 columns on large screens)
  // 12 items = 3 full rows, 16 items = 4 full rows, 20 items = 5 full rows
  const itemsPerPage = 16

  const getPriceRange = (range: string) => {
    switch (range) {
      case "0-100":
        return { min: 0, max: 100 }
      case "100-200":
        return { min: 100, max: 200 }
      case "200-300":
        return { min: 200, max: 300 }
      case "300-400":
        return { min: 300, max: 400 }
      case "400-500":
        return { min: 400, max: 500 }
      case "500+":
        return { min: 500, max: Number.POSITIVE_INFINITY }
      default:
        return null
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)

        if (!matchesSearch) {
          return false
        }
      }

      // Category filter
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(product.category)) {
        return false
      }

      // Brand filter
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(product.brand)) {
        return false
      }

      // Price range filter
      if (filters.selectedPriceRange) {
        const range = getPriceRange(filters.selectedPriceRange)
        if (range && (product.price < range.min || product.price > range.max)) {
          return false
        }
      }

      // Min/Max price filter
      const min = filters.minPrice ? Number.parseFloat(filters.minPrice) : 0
      const max = filters.maxPrice ? Number.parseFloat(filters.maxPrice) : Number.POSITIVE_INFINITY
      if (product.price < min || product.price > max) {
        return false
      }

      return true
    })
  }, [products, filters, searchQuery])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    if (filters.sortBy === "price-high-low") {
      return sorted.sort((a, b) => b.price - a.price)
    }
    if (filters.sortBy === "price-low-high") {
      return sorted.sort((a, b) => a.price - b.price)
    }
    return sorted
  }, [filteredProducts, filters.sortBy])

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedProducts, currentPage, itemsPerPage])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleCategoryTabChange = (category: string) => {
    const newFilters = {
      ...filters,
      selectedCategories: category === "All Products" ? [] : [category],
    }
    handleFiltersChange(newFilters)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const clearSearch = () => {
    setSearchQuery("")
    setCurrentPage(1)
  }

  return {
    filters,
    searchQuery,
    currentPage,
    totalPages,
    paginatedProducts,
    totalProducts: sortedProducts.length,
    handleFiltersChange,
    handleCategoryTabChange,
    handleSearch,
    setSearchQuery,
    clearSearch,
    setCurrentPage,
  }
}
