export interface FilterState {
  selectedCategories: string[]
  selectedBrands: string[]
  selectedPriceRange: string
  minPrice: string
  maxPrice: string
  sortBy: string
}

export interface FilterProps {
  onFiltersChange: (filters: FilterState) => void
  initialFilters: FilterState
}
