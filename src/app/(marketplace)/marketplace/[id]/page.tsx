"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, ShoppingCart } from "lucide-react"
import { notFound, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { useMarketplaceStore } from "@/store/product"
import { useAuthStore } from "@/store/auth-store"
import { CartNotification } from "@/components/marketplace/cart-notification"
import { CartSummary } from "@/components/marketplace/cart-summary"
import { FloatingCartButton } from "@/components/marketplace/floating-cart-button"
import type { Product } from "@/lib/types"
import toast from "react-hot-toast"

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false)
  const [notification, setNotification] = useState<{ show: boolean; productName: string; message?: string }>({
    show: false,
    productName: "",
    message: "",
  })

  const DESCRIPTION_MAX_LENGTH = 500
  const shouldTruncateDescription = product && product.description && product.description.length > DESCRIPTION_MAX_LENGTH

  const { addItem, totalItems } = useCartStore()
  const { fetchProductById, isLoading, error, products, fetchAllProducts } = useMarketplaceStore()
  const { isAuthenticated } = useAuthStore()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    if (!id) {
      console.log('[ProductDetail] No ID provided')
      setHasAttemptedFetch(true)
      return
    }
    
    if (typeof id === 'string') {
      console.log('[ProductDetail] Fetching product with ID:', id)
      setHasAttemptedFetch(true)
      
      // First, try to find product in local products array (faster, no API call)
      const localProduct = products.find(p => p.id === id)
      if (localProduct) {
        console.log('[ProductDetail] Found product in local array:', localProduct)
        setProduct(localProduct)
        return
      }
      
      // If products array is empty, try to load all products first
      if (products.length === 0) {
        console.log('[ProductDetail] Products array is empty, fetching all products first')
        fetchAllProducts()
        // Note: After fetchAllProducts completes, the products will update and this effect will re-run
        // The local product check above will catch it on the next render
        return
      }
      
      // If not found locally and products are loaded, fetch from API
      fetchProductById(id)
        .then((fetchedProduct) => {
          console.log('[ProductDetail] Fetched product from API:', fetchedProduct)
        if (fetchedProduct) {
          setProduct(fetchedProduct)
          } else {
            console.log('[ProductDetail] No product returned from API')
        }
      })
        .catch((err) => {
          console.error('[ProductDetail] Error fetching product:', err)
        })
    }
  }, [id, fetchProductById, products, fetchAllProducts])

  // Get related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    
    const sameCategory = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 6)
    
    // If no products in same category, show other products
    if (sameCategory.length === 0) {
      return products
        .filter(p => p.id !== product.id)
        .slice(0, 6)
    }
    
    return sameCategory
  }, [products, product])

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product) return

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

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, productName: "", message: "" })
      }, 3000)
    } else {
      // Only show notification for other errors (not login required)
      setNotification({
        show: true,
        productName: product.name,
        message: result.error || "Failed to add to cart",
      })
    }
  }

  // Show loading state while fetching
  if (isLoading || !hasAttemptedFetch) {
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 text-base md:text-lg mt-4">Loading product...</p>
        </div>
      </div>
    )
  }

  // Show error state - only if we've attempted fetch and are done loading
  if (hasAttemptedFetch && !isLoading && error && !product) {
    // Check if error is 404 or not found
    const errorLower = error.toLowerCase()
    const isNotFound = errorLower.includes('not found') || errorLower.includes('404') || errorLower.includes('product not found')
    
    if (isNotFound) {
      // Show user-friendly error message instead of 404 page
      return (
        <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">Product Not Found</h1>
            <p className="text-gray-600 dark:text-muted-foreground mb-6">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                  Back to Marketplace
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 text-base md:text-lg mb-4">Error: {error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                Back to Marketplace
              </Button>
            </Link>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
          </div>
        </div>
      </div>
    )
  }

  // Only show 404 if we've attempted fetch, are done loading, have no error, but still no product
  if (hasAttemptedFetch && !isLoading && !error && !product) {
    console.log('[ProductDetail] Showing error - no product found after fetch')
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-muted-foreground mb-6">
            The product you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/marketplace">
            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // If we don't have a product yet, show loading (shouldn't reach here but safety check)
  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 text-base md:text-lg mt-4">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Full Size Image Modal */}
      {/* Modal code removed as per updates */}

      <div className="max-w-7xl mx-auto px-6 py-8 mt-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-gray-700 dark:text-foreground dark:hover:text-foreground/80"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>

        {/* Debug Info - Remove this in production */}
        {/* Debug info code removed as per updates */}

        <div className="grid grid-cols-12 gap-4">
          {/* Thumbnail Gallery - Left Side */}
          <div className="col-span-2  ">
            <div className="w-full space-y-4 flex flex-col items-center  h-[70%]">
              {product.images.map((image: string, index: number) => (
                <button
                  key={`thumbnail-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-[90%]  aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-gray-200 hover:border-gray-300 dark:border-border"
                  }`}
                >
                  <div
                    className="w-full h-full bg-gray-50 dark:bg-muted"
                    style={{
                      backgroundImage: image ? `url(${image})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main Product Image - Center */}
          <div className="col-span-5">
            <div className="aspect-square bg-gray-50 dark:bg-muted rounded-lg overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: product.images[selectedImage] ? `url(${product.images[selectedImage]})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="col-span-5 space-y-8 items-center px-8">
            {/* Product Title and Price */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground leading-tight">{product.name}</h1>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-foreground">
                  GH₵ {product.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 dark:text-muted-foreground flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                  Per {product.unit || "Box"}
                </span>
              </div>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground uppercase tracking-wide">Brand</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">{product.brand}</p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground uppercase tracking-wide">Description</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {shouldTruncateDescription && !isDescriptionExpanded
                    ? `${product.description.substring(0, DESCRIPTION_MAX_LENGTH)}...`
                    : product.description}
                </p>
                {shouldTruncateDescription && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    {isDescriptionExpanded ? "View less" : "View more"}
                  </button>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-2">
            <Button
              onClick={handleAddToCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-base font-semibold rounded-lg"
            >
              Add to cart
            </Button>
            </div>

            {/* Secured Payment */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs">100% Secured Payment</span>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 dark:border-border pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground uppercase tracking-wide">Product Details</h3>
                {product.id && product.id.length > 35 && (
                  <button
                    onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    {isDetailsExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">Product ID:</span>
                  <span className={`text-xs text-gray-900 dark:text-foreground font-mono text-right ${isDetailsExpanded || (product.id && product.id.length <= 35) ? 'break-all' : 'truncate max-w-[180px]'}`}>
                    {product.id && product.id.length > 35 && !isDetailsExpanded
                      ? `${product.id.substring(0, 35)}...`
                      : product.id}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">Category:</span>
                  <span className="text-xs text-gray-900 dark:text-foreground text-right">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12 border-t border-gray-200 dark:border-border pt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-foreground mb-6">
            Related Products
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/marketplace/${relatedProduct.id}`}
                  className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-50 dark:bg-muted relative overflow-hidden">
                    <div
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${relatedProduct.images?.[0] || "/placeholder.svg?height=150&width=150"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-2">
                    <h3 className="font-medium text-gray-900 dark:text-foreground text-xs line-clamp-2 mb-0.5 leading-tight">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-muted-foreground mb-1.5 truncate">
                      {relatedProduct.brand}
                    </p>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-gray-900 dark:text-foreground text-xs">
                        GH₵ {relatedProduct.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (!isAuthenticated) {
                            toast.error("Cannot add to cart — please log in.")
                            return
                          }
                          const result = await addItem(relatedProduct)
                          if (result.success) {
                            toast.success(`${relatedProduct.name} added to cart!`)
                          } else if (result.error !== "LOGIN_REQUIRED") {
                            toast.error(result.error || "Failed to add to cart")
                          }
                        }}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded h-6 w-6 p-0 min-w-0"
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-muted rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-muted-foreground/20" />
                  <div className="p-2 space-y-1.5">
                    <div className="h-3 bg-gray-200 dark:bg-muted-foreground/20 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 dark:bg-muted-foreground/20 rounded w-1/2" />
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-200 dark:bg-muted-foreground/20 rounded w-12" />
                      <div className="h-6 w-6 bg-gray-200 dark:bg-muted-foreground/20 rounded" />
                    </div>
                  </div>
                </div>
              ))}
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
