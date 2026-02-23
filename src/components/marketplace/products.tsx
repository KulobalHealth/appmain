"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { LayoutGrid, List, Search, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MarketplaceFilters } from "@/components/market-filters"
import { Pagination } from "@/components/pagination"
import { Icons } from "@/components/ui/icons"
import { useMarketplace } from "@/hooks/use-marketplace"
import { useCartStore } from "@/store/cart-store"
import { useMarketplaceStore } from "@/store/product"
import { useAuthStore } from "@/store/auth-store"
import { CartNotification } from "@/components/marketplace/cart-notification"
import { CartSummary } from "@/components/marketplace/cart-summary"
import { FloatingCartButton } from "@/components/marketplace/floating-cart-button"
import Link from "next/link"
import type { Product } from "@/lib/types"
import toast from "react-hot-toast"
import { useEffect } from "react"

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const {
    filters,
    searchQuery,
    currentPage,
    totalPages,
    paginatedProducts,
    totalProducts,
    handleFiltersChange,
    handleCategoryTabChange,
    handleSearch,
    setSearchQuery,
    clearSearch,
    setCurrentPage,
  } = useMarketplace()

  const { addItem, getItemQuantity, removeItem, totalItems, fetchCartItems } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { isLoading, error, products } = useMarketplaceStore()

  // Fetch cart items when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Marketplace - Fetching cart items on mount")
      fetchCartItems()
    }
  }, [isAuthenticated, fetchCartItems])
  const [notification, setNotification] = useState<{ show: boolean; productName: string; message?: string }>({
    show: false,
    productName: "",
    message: "",
  })

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // Prevent navigation when clicking add to cart
    e.stopPropagation()
    
    // Check authentication first - show toast if not logged in
    if (!isAuthenticated) {
      toast.error("Cannot add to cart — please log in.")
      return
    }
    
    const wasEmpty = totalItems === 0
    const result = await addItem(product)
    
    // If login required, show toast
    if (!result.success && result.error === "LOGIN_REQUIRED") {
      toast.error("Cannot add to cart — please log in.")
      return
    }
    
    if (result.success) {
      setNotification({
        show: true,
        productName: product.name,
        message: wasEmpty ? "Added to Cart!" : "Updated Cart!",
      })
    } else {
      // Only show notification for other errors (not login required)
      setNotification({
        show: true,
        productName: product.name,
        message: result.error || "Failed to add to cart",
      })
    }
  }

  const handleRemoveFromCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const result = await removeItem(productId)
    if (!result.success) {
      setNotification({
        show: true,
        productName: "Item",
        message: result.error || "Failed to remove from cart",
      })
    }
  }

  const toggleDescription = (productId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const DESCRIPTION_MAX_LENGTH = 150

  // Get unique categories from products dynamically
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>()
    products.forEach((product) => {
      if (product.category) {
        categories.add(product.category)
      }
    })
    return Array.from(categories).sort()
  }, [products])

  // Create category tabs with dynamic categories
  const categoryTabs = useMemo(() => {
    const tabs = [{ label: "All Products", value: "All Products" }]
    
    // Add common category mappings for display
    const categoryMappings: Record<string, string> = {
      "Test Kit": "Test Kit",
      "Testing Kits": "Testing Kits",
      "Vital Monitoring Devices": "Vital Monitoring Devices",
      "Medical Materials": "Medical Materials",
      "Vaccines": "Vaccines",
    }
    
    // Add unique categories from products
    uniqueCategories.forEach((category) => {
      // Use the category as-is if it exists, or use a mapped display name
      const displayName = categoryMappings[category] || category
      if (!tabs.find((tab) => tab.value === category)) {
        tabs.push({ label: displayName, value: category })
      }
    })
    
    return tabs
  }, [uniqueCategories])

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50 dark:bg-background dark:text-foreground">
      {/* Search Section */}
      <section className="bg-green-50 pt-28 md:pt-32 pb-10 md:pb-14 px-4 relative dark:bg-primary-900 mb-6 md:mb-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-green-50 dark:bg-primary-900">
          <Icons.Banner className="w-full h-full opacity-20 text-green-600" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold text-green-600 mb-3 md:mb-4">
            What product are you looking for?
          </h1>
          <p className="text-center text-sm md:text-base lg:text-lg text-gray-600 mb-6 dark:text-white px-2">
            One-Stop Med Supply Ordering. Find all the medical supplies you need for your pharmacy in one place.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-xl mx-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for product"
                className="w-full rounded-md border border-gray-300 py-3 md:py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 md:py-2 rounded-md transition-colors font-medium"
            >
              Search
            </button>
          </form>
          {searchQuery && (
            <div className="flex justify-center mt-4">
              <button onClick={clearSearch} className="text-sm text-gray-600 hover:text-gray-800 underline">
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 md:p-6 lg:px-30">
        {/* Filters Sidebar - Hidden on mobile, shown as modal or collapsible */}
        <div className=" lg:flex-shrink-0 sm:mb-0 mb-16">
          <MarketplaceFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />
        </div>

        {/* Products Section */}
        <div className="flex-1 space-y-4 md:space-y-6 lg:px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-semibold">
              {searchQuery
                ? `Search results for "${searchQuery}" (${totalProducts})`
                : `Featured Products (${totalProducts})`}
            </h2>
            <div className="flex gap-2 self-start sm:self-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="bg-emerald-600 hover:bg-emerald-700 h-9 w-9 md:h-10 md:w-10"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-9 w-9 md:h-10 md:w-10"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {categoryTabs.map((tab) => (
              <Button
                key={tab.value}
                variant={
                  (tab.value === "All Products" && filters.selectedCategories.length === 0) ||
                  filters.selectedCategories.includes(tab.value)
                    ? "default"
                    : "outline"
                }
                onClick={() => handleCategoryTabChange(tab.value)}
                className={`${
                  (tab.value === "All Products" && filters.selectedCategories.length === 0) ||
                  filters.selectedCategories.includes(tab.value)
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-background"
                } px-3 md:px-4 py-2 rounded-lg font-medium text-sm dark:text-foreground`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Active Filters Display */}
          {(searchQuery ||
            filters.selectedCategories.length > 0 ||
            filters.selectedBrands.length > 0 ||
            filters.selectedPriceRange ||
            filters.minPrice ||
            filters.maxPrice) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={clearSearch} className="ml-1 text-green-600 hover:text-green-800">
                    ×
                  </button>
                </span>
              )}
              {filters.selectedCategories.map((category) => (
                <span
                  key={category}
                  className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs md:text-sm"
                >
                  {category}
                  <button
                    onClick={() =>
                      handleFiltersChange({
                        ...filters,
                        selectedCategories: filters.selectedCategories.filter((c) => c !== category),
                      })
                    }
                    className="ml-1 text-emerald-600 hover:text-emerald-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.selectedBrands.map((brand) => (
                <span key={brand} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  {brand}
                  <button
                    onClick={() =>
                      handleFiltersChange({
                        ...filters,
                        selectedBrands: filters.selectedBrands.filter((b) => b !== brand),
                      })
                    }
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.selectedPriceRange && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  ₵{filters.selectedPriceRange.replace("-", " - ₵")}
                  <button
                    onClick={() => handleFiltersChange({ ...filters, selectedPriceRange: "" })}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 md:py-12 px-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-gray-500 text-base md:text-lg mt-4">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 md:py-12 px-4 bg-white rounded-lg shadow-sm border border-gray-100">
              {(error.toLowerCase().includes("log in") || error.toLowerCase().includes("authentication")) && !isAuthenticated ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Please log in to your pharmacy account to browse and order products from our marketplace.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => window.location.href = '/login'} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Log In
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/signup'} 
                      variant="outline"
                    >
                      Create Account
                    </Button>
                  </div>
                </>
              ) : isAuthenticated ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Refresh Needed</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Please log out and log in again to refresh your session. This is a one-time fix.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => {
                        // Clear local auth markers and redirect to login
                        document.cookie = 'auth-token=; path=/; max-age=0'
                        localStorage.setItem('auth_logged_out', 'true')
                        window.location.href = '/login'
                      }} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Log In Again
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Products</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="text-sm md:text-base"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Products Grid/List */}
          {!isLoading && !error && (
            <>
              {viewMode === "list" ? (
                <div className="space-y-4">
                  {paginatedProducts.map((product) => {
                    const isDescriptionExpanded = expandedDescriptions[product.id] || false
                    const shouldTruncateDescription = product.description && product.description.length > DESCRIPTION_MAX_LENGTH
                    const displayDescription = shouldTruncateDescription && !isDescriptionExpanded
                      ? `${product.description.substring(0, DESCRIPTION_MAX_LENGTH)}...`
                      : product.description

                    return (
                    <div key={product.id} className="relative">
                      <Link href={`/marketplace/${product.id}`} className="block">
                          <div className="border border-gray-200 dark:border-border rounded-xl p-4 md:p-5 hover:shadow-xl transition-all duration-200 cursor-pointer dark:bg-card group">
                          <div className="flex flex-row gap-4 md:gap-6 items-start">
                            {/* Product Image */}
                            <div className="w-[120px] sm:w-[150px] md:w-[180px] h-[120px] sm:h-[150px] md:h-[180px] dark:bg-neutral-900 rounded-lg flex-shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center p-2">
                              <img
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            {/* Product Info */}
                              <div className="flex-1 space-y-3 min-w-0">
                                <div className="space-y-1">
                                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-card-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors line-clamp-1">
                                  {product.name}
                                </h3>
                                  <p className="text-xs md:text-sm text-gray-500 dark:text-muted-foreground">{product.brand}</p>
                              </div>

                                <div className="flex items-center gap-2">
                                  <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-card-foreground">
                                  GH₵ {product.price.toFixed(2)}
                                </p>
                                  {product.unit && (
                                    <span className="text-xs text-gray-400 dark:text-muted-foreground">
                                      per {product.unit}
                                    </span>
                                  )}
                              </div>

                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                                    {displayDescription}
                                  </p>
                                  {shouldTruncateDescription && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        toggleDescription(product.id)
                                      }}
                                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                    >
                                      {isDescriptionExpanded ? "View less" : "View more"}
                                    </button>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                                {getItemQuantity(product.id) > 0 ? (
                                  <>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs md:text-sm h-9"
                                      onClick={(e) => handleAddToCart(e, product)}
                                    >
                                      In Cart ({getItemQuantity(product.id)})
                                    </Button>
                                    <Button
                                      variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 text-xs md:text-sm h-9"
                                      onClick={(e) => handleRemoveFromCart(e, product.id)}
                                    >
                                      Remove
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 text-xs md:text-sm h-9"
                                    onClick={(e) => handleAddToCart(e, product)}
                                  >
                                    Add to Cart
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    )
                  })}
                </div>
              ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <Link href={`/marketplace/${product.id}`}>
                    <Card className="w-full overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow bg-transparent">
                      <div className="w-full h-[180px] md:h-[200px] dark:bg-neutral-900 relative flex items-center justify-center p-4">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <CardContent className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                        <h3 className="font-medium group-hover:text-emerald-600 transition-colors text-xs md:text-sm truncate">
                          {product.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-1">
                          <p className="font-medium text-xs md:text-sm">GH₵ {product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex  gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                          {getItemQuantity(product.id) > 0 ? (
                            <>
                              <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm py-2 flex-1"
                                onClick={(e) => handleAddToCart(e, product)}
                              >
                                In Cart ({getItemQuantity(product.id)})
                              </Button>
                              <Button
                             
                              
                                className="bg-red-700/70 text-white text-xs py-2"
                                onClick={(e) => handleRemoveFromCart(e, product.id)}
                              >
                               <Trash2Icon/> Remove
                              </Button>
                            </>
                          ) : (
                            <Button
                              className="w-full text-xs md:text-sm py-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              Add to cart
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!isLoading && !error && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}

          {!isLoading && !error && paginatedProducts.length === 0 && (
            <div className="text-center py-8 md:py-12 px-4">
              <p className="text-gray-500 text-base md:text-lg mb-4">
                {searchQuery ? `No products found for "${searchQuery}"` : "No products found matching your filters."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery && (
                  <Button onClick={clearSearch} variant="outline" className="text-sm md:text-base">
                    Clear Search
                  </Button>
                )}
                <Button
                  onClick={() =>
                    handleFiltersChange({
                      selectedCategories: [],
                      selectedBrands: [],
                      selectedPriceRange: "",
                      minPrice: "",
                      maxPrice: "",
                      sortBy: "default",
                    })
                  }
                  variant="outline"
                  className="text-sm md:text-base"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Cart Notification */}
      <CartNotification
        show={notification.show}
        productName={notification.productName}
        message={notification.message}
        onClose={() => setNotification({ show: false, productName: "", message: "" })}
      />

      {/* Cart Summary */}
      <CartSummary />
      {/* Floating Cart Button for Mobile */}
      <FloatingCartButton />
    </div>
  )
}
