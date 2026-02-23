"use client"

import { Activity } from "lucide-react"
import { useOrderStats } from "@/hooks/use-order-stats"

export function DataDisplay() {
  const orderStats = useOrderStats()
  
  const data = [
    { label: "Pending Orders", value: orderStats.pendingOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.pendingOrders / orderStats.totalOrders) * 100) : 0, color: "bg-yellow-500" },
    { label: "Processing Orders", value: orderStats.processingOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.processingOrders / orderStats.totalOrders) * 100) : 0, color: "bg-blue-500" },
    { label: "Shipped Orders", value: orderStats.shippedOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.shippedOrders / orderStats.totalOrders) * 100) : 0, color: "bg-orange-500" },
    { label: "Delivered Orders", value: orderStats.deliveredOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.deliveredOrders / orderStats.totalOrders) * 100) : 0, color: "bg-green-500" },
  ]

  return (
    <div className="dark:text-white border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Statistics</h3>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
          <Activity className="w-3 h-3 text-green-600" />
          <span className="text-xs font-semibold text-green-800">{orderStats.totalOrders} Total</span>
        </div>
      </div>
      <div className="space-y-3 dark:text-white">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-700 dark:text-white">{item.label}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-100 dark:bg-transparent dark:text-white">
              <div
                className={`${item.color} h-full rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
