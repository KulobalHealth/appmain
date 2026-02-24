"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "../sidebar";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import stores to avoid SSR issues
const useOrdersStore = dynamic(() => import("@/store/orders-store").then(mod => ({ default: mod.useOrdersStore })), { ssr: false });
const useAuthStore = dynamic(() => import("@/store/auth-store").then(mod => ({ default: mod.useAuthStore })), { ssr: false });

const getStatusClasses = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

export default function OrderHistory() {
  const [mounted, setMounted] = useState(false);
  const { orders, fetchOrders, isLoading } = useOrdersStore();
  const { isAuthenticated, user } = useAuthStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const filterOptions = [
    { label: "All Orders", value: "all" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Orders page mounted, fetching orders...');
      console.log('User authenticated:', isAuthenticated);
      console.log('Current user:', user);
    }
    
    if (isAuthenticated && user) {
      fetchOrders();
    } else if (typeof window !== 'undefined') {
      console.log('User not authenticated, cannot fetch orders');
    }
  }, [fetchOrders, isAuthenticated, user]);

  // Only log on client side
  if (typeof window !== 'undefined') {
    console.log('Current orders state:', orders);
    console.log('Filtered orders:', filteredOrders);
  }

  // Don't render until mounted on client side
  if (!mounted) {
    return (
      <div className="flex flex-col md:flex-row container mx-auto">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="text-center py-8 text-gray-500">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row container mx-auto">
      <Sidebar />

      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Orders & Purchase History</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filterStatus === option.value ? "default" : "outline"}
                className={`text-sm rounded-full ${
                  filterStatus === option.value
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : ""
                }`}
                onClick={() => setFilterStatus(option.value)}
              >
                {option.label}
              </Button>
            ))}
            <div className="ml-auto">
              <Button variant="outline" className="text-sm">
                Filter by <Filter className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {!isAuthenticated ? (
            <div className="text-center py-8 text-gray-500">
              Please log in to view your orders.
            </div>
          ) : isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading orders...
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Link 
                key={order.id}
                href={`/marketplace/orders/${order.id}`}
                className="block border rounded-lg overflow-hidden bg-white dark:bg-background hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <div className="p-3 flex items-center gap-3">
                  {/* Compact Image */}
                  <div className="bg-gray-100 rounded-md w-14 h-14 flex-shrink-0 flex items-center justify-center dark:bg-neutral-900">
                    <Image
                      src="/med.png"
                      alt="Product"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  {/* Order Info - Compact */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </h3>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status === "delivered" ? (
                          <CheckCircle className="mr-0.5 h-2.5 w-2.5" />
                        ) : (
                          <Clock className="mr-0.5 h-2.5 w-2.5" />
                        )}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      Order #{order.orderNumber}
                    </p>
                  </div>

                  {/* Price & Date */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-foreground">
                      GH₵ {(order.totalCost || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {isAuthenticated ? "No orders found" : "Please log in to view your orders"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
