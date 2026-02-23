"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMarketplaceStore } from "../store/product"
import type { FilterState, FilterProps } from "../types/filters"

export function MarketplaceFilters({ onFiltersChange, initialFilters }: FilterProps) {
  const { products } = useMarketplaceStore()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sortByOpen, setSortByOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [brandOpen, setBrandOpen] = useState(true)

  // Get unique categories and brands from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))]
    return uniqueCategories.filter(Boolean).sort()
  }, [products])

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(product => product.brand))]
    return uniqueBrands.filter(Boolean).sort()
  }, [products])

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.selectedCategories, category]
      : filters.selectedCategories.filter((c) => c !== category)
    updateFilters({ selectedCategories: newCategories })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...filters.selectedBrands, brand] : filters.selectedBrands.filter((b) => b !== brand)
    updateFilters({ selectedBrands: newBrands })
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      selectedCategories: [],
      selectedBrands: [],
      selectedPriceRange: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "default",
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <div className="w-80 space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
      </div>

      {/* Sort By */}
      <div className="border rounded-lg p-4 bg-white dark:bg-background dark:text-foreground">
        <button onClick={() => setSortByOpen(!sortByOpen)} className="flex items-center justify-between mb-3 w-full">
          <h3 className="font-medium">Sort By</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${sortByOpen ? "rotate-180" : ""}`} />
        </button>
        {sortByOpen && (
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                value="price-high-low"
                checked={filters.sortBy === "price-high-low"}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm">Price: High - Low</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                value="price-low-high"
                checked={filters.sortBy === "price-low-high"}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm">Price: Low - High</span>
            </label>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border rounded-lg p-4 bg-white dark:bg-background dark:text-foreground">
        <button onClick={() => setPriceOpen(!priceOpen)} className="flex items-center justify-between mb-3 w-full">
          <h3 className="font-medium">Price, GHC</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${priceOpen ? "rotate-180" : ""}`} />
        </button>
        {priceOpen && (
          <>
            {/* Min/Max inputs */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>
              <span className="self-center">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>
            </div>

            {/* Price range options */}
            <div className="space-y-2 dark:bg-background dark:text-foreground">
              {["0-100", "100-200", "200-300", "300-400", "400-500", "500+"].map((range) => (
                <label key={range} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range}
                    checked={filters.selectedPriceRange === range}
                    onChange={(e) => updateFilters({ selectedPriceRange: e.target.value })}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm">₵{range.replace("-", " - ₵")}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category */}
      <div className="border rounded-lg p-4 bg-white dark:bg-background dark:text-foreground">
        <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex items-center justify-between mb-3 w-full"
        >
          <h3 className="font-medium">Category</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
        </button>
        {categoryOpen && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.selectedCategories.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="border rounded-lg p-4 bg-white dark:bg-background dark:text-foreground">
        <button onClick={() => setBrandOpen(!brandOpen)} className="flex items-center justify-between mb-3 w-full">
          <h3 className="font-medium">Brand</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${brandOpen ? "rotate-180" : ""}`} />
        </button>
        {brandOpen && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.selectedBrands.includes(brand)}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <Button onClick={clearAllFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  )
}
