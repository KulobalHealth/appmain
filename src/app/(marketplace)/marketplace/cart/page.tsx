"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useMarketplaceStore } from "@/store/product";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function CartPage() {
  const { items: cartItems, removeItem, updateQuantity, fetchCartItems, isLoading, error } = useCartStore();
  const { products } = useMarketplaceStore();

  useEffect(() => {
    // Fetch cart items when the page loads
    fetchCartItems();
  }, [fetchCartItems]);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price ?? 0) * item.quantity;
  }, 0);

  const tax = subtotal * 0.03;
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 text-base md:text-lg mt-4">Loading cart...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 text-base md:text-lg mb-4">Error: {error}</p>
          <Button onClick={() => fetchCartItems()} variant="outline">
            Retry
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:bg-background bg-white">
              <h1 className="text-xl font-bold">
                My Cart ({cartItems.length})
              </h1>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border-b bg-white dark:bg-background"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-gray-100 p-4 rounded-md w-full sm:w-36 h-36 flex items-center justify-center dark:bg-neutral-900">
                    <Image
                      src={item.product?.images?.[0] ?? "/placeholder.svg"}
                      alt={item.name ?? "Product"}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {item.product?.brand}
                      </p>
                    </div>

                    <button
                      onClick={async () => await removeItem(item.id)}
                      className="text-primary-600 text-sm font-medium mt-2 w-fit"
                    >
                      Remove from cart
                    </button>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <span className="font-bold text-lg">
                      GH₵{" "}
                      {((item.price ?? 0) * item.quantity).toFixed(2)}
                    </span>

                    <div className="flex items-center mt-2 bg-neutral-500 dark:bg-neutral-900 rounded-full">
                      <button
                        className="w-9 h-9 p-[5px] flex items-center bg-neutral-500 justify-center rounded-full"
                        onClick={async () =>
                          await updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        <span className="flex w-7 h-7 p-[15px] items-center justify-center rounded-full bg-[#F6F6F7] dark:bg-[#2e2e2e]">
                          -
                        </span>
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="w-9 h-9 bg-neutral-500 flex items-center justify-center rounded-full"
                        onClick={async () =>
                          await updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <span className="flex w-7 h-7 p-[15px] items-center justify-center rounded-full bg-[#F6F6F7] dark:bg-[#2e2e2e]">
                          +
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Your cart is empty.
                <Link
                  href="/marketplace"
                  className="block text-emerald-500 mt-2"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="lg:col-span-1">
            <div className="border rounded-lg overflow-hidden dark:bg-background bg-white">
              <div className="p-4 border-b">
                <h2 className="font-bold">Cart Summary</h2>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span>Items</span>
                <span className="font-bold">{cartItems.length}</span>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold">GH₵ {subtotal.toFixed(2)}</span>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span>Tax (3%)</span>
                <span className="font-bold">GH₵ {tax.toFixed(2)}</span>
              </div>

              <div className="p-4 border-b">
                <h3 className="mb-2">Get it your way</h3>
                <RadioGroup defaultValue="pickup" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Pick up</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl">
                  GH₵ {total.toFixed(2)}
                </span>
              </div>

              <div className="p-4">
                <Link href="/marketplace/checkout">
                  <Button className="w-full ">Continue to checkout</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
