"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMarketplaceStore } from "@/store/product";
import { useAuthStore } from "@/store/auth-store";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ProductGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { products, addToCart } = useMarketplaceStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first - show toast if not logged in
    if (!isAuthenticated) {
      toast.error("Cannot add to cart — please log in.");
      return;
    }
    
    addToCart(productId);
  };

  const filteredProducts = products;

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]"
            : "space-y-4"
        }
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.id}`}
              className={`group block ${
                viewMode === "list" ? "border rounded-lg p-4" : ""
              }`}
            >
              <div
                className={
                  viewMode === "grid"
                    ? "border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    : "flex gap-4 items-center"
                }
              >
                <div
                  className={
                    viewMode === "grid"
                      ? "w-full h-full dark:bg-neutral-900 bg-(--search-bar-bg) relative flex items-center justify-center"
                      : "w-[260px] h-[189px] dark:bg-neutral-900 bg-(--search-bar-bg) relative shrink-0 flex items-center justify-center"
                  }
                >
                  <div className="relative w-[260px] h-[189px]">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                </div>
                <div className={viewMode === "grid" ? "p-4" : "flex-1"}>
                  <h3 className="font-medium group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                  <div
                    className={`flex ${
                      viewMode === "grid" ? "justify-between" : "gap-4"
                    } items-center mt-2`}
                  >
                    <p className="font-medium">
                      GH₵ {product.price.toFixed(2)}
                    </p>
                  </div>
                  {viewMode === "list" && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">
                        {product.description}
                      </p>
                      <Button
                        className="mt-3 bg-primary-600 text-white"
                        onClick={(e) => handleAddToCart(e, product.id)}
                      >
                        Add to Cart
                      </Button>
                    </>
                  )}
                  {viewMode === "grid" && (
                    <Button
                      className="w-full mt-3 text-white bg-primary-600"
                      onClick={(e) => handleAddToCart(e, product.id)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              No items found matching your search criteria
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
