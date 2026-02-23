"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, CreditCard, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"
import { useMarketplaceStore } from "@/store/product"
import Link from "next/link"
import type { Product } from "@/lib/products"
import toast from "react-hot-toast"

// Mock product data - in real app this would come from props or API
const mockProduct: Product = {
  id: "1",
  name: "Malaria Test Kits",
  brand: "OraSure Technologies",
  price: 200.0,
  description: "Professional rapid diagnostic test kits for malaria detection.",
  category: "Testing Kits",
  stockQuantity: 30,
  unit: "boxes",
  inStock: true,
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
}

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { products, fetchAllProducts } = useMarketplaceStore()
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  })

  // Fetch products on mount
  useEffect(() => {
    fetchAllProducts()
  }, [fetchAllProducts])

  // Get related products (same category, excluding current product)
  // If no products in same category, show any other products
  const relatedProducts = useMemo(() => {
    const sameCategory = products
      .filter(p => p.category === mockProduct.category && p.id !== mockProduct.id)
      .slice(0, 4)
    
    // If no products in same category, show other products
    if (sameCategory.length === 0) {
      return products
        .filter(p => p.id !== mockProduct.id)
        .slice(0, 4)
    }
    
    return sameCategory
  }, [products])

  const handleAddToCart = async () => {
    // Check authentication first - show toast if not logged in
    if (!isAuthenticated) {
      toast.error("Cannot add to cart — please log in.")
      return
    }

    const result = await addItem(mockProduct)
    
    // If login required, show toast
    if (!result.success && result.error === "LOGIN_REQUIRED") {
      toast.error("Cannot add to cart — please log in.")
      return
    }
    
    if (result.success) {
      setNotification({ show: true, message: "Added to cart!" })
      setTimeout(() => setNotification({ show: false, message: "" }), 3000)
    } else {
      // Only show notification for other errors (not login required)
      setNotification({ show: true, message: result.error || "Failed to add to cart" })
      setTimeout(() => setNotification({ show: false, message: "" }), 3000)
    }
  }

  const descriptionPoints = ["Description goes here", "Description goes here", "Description goes here"]

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 mt-16">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 mb-8 text-lg font-medium text-gray-900 hover:text-gray-700 dark:text-foreground dark:hover:text-foreground/80"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>

        <div className="grid grid-cols-12 gap-8">
          {/* Thumbnail Gallery - Left Side */}
          <div className="col-span-2">
            <div className="space-y-4">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-full aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-gray-200 hover:border-gray-300 dark:border-border"
                  }`}
                >
                  <div
                    className="w-full h-full bg-gray-50 dark:bg-muted"
                    style={{
                      backgroundImage: `url(${image})`,
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
          <div className="col-span-6">
            <div className="aspect-square bg-gray-50 dark:bg-muted rounded-lg overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${mockProduct.images[selectedImage]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="col-span-4 space-y-6">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">{mockProduct.name}</h1>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-foreground">
                  GH₵ {mockProduct.price.toFixed(2)}
                </span>
                <span className="text-gray-500 dark:text-muted-foreground flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  Per Box
                </span>
              </div>
            </div>

            {/* Brand */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">Brand</h3>
              <p className="text-gray-600 dark:text-muted-foreground">{mockProduct.brand}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-3">Description</h3>
              <ul className="space-y-2">
                {descriptionPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg font-semibold rounded-lg"
              disabled={!mockProduct.inStock}
            >
              Add to cart
            </Button>

            {/* Secured Payment */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">100% Secured Payment</span>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 border-t border-gray-200 dark:border-border pt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-6">
            Related Products
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <RelatedProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={async () => {
                    if (!isAuthenticated) {
                      toast.error("Cannot add to cart — please log in.")
                      return
                    }
                    const result = await addItem(product)
                    if (result.success) {
                      toast.success(`${product.name} added to cart!`)
                    } else if (result.error !== "LOGIN_REQUIRED") {
                      toast.error(result.error || "Failed to add to cart")
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-muted rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-muted-foreground/20" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-muted-foreground/20 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-muted-foreground/20 rounded w-1/2" />
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-200 dark:bg-muted-foreground/20 rounded w-20" />
                      <div className="h-8 w-8 bg-gray-200 dark:bg-muted-foreground/20 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Related Product Card Component
function RelatedProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: Product
  onAddToCart: () => void 
}) {
  return (
    <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 dark:bg-muted relative">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${product.images?.[0] || "/placeholder.svg?height=200&width=200"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-foreground text-sm line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-muted-foreground mb-2">
          {product.brand}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 dark:text-foreground">
            GH₵ {product.price.toFixed(2)}
          </span>
          <Button
            onClick={onAddToCart}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 px-3"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
