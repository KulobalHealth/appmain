"use client"

import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { useOrdersStore } from "@/store/orders-store"
import { useMemo } from "react"

export default function RecentTransactions() {
  const { orders } = useOrdersStore()

  const transactions = useMemo(() => {
    return orders
      .slice(0, 5) // Get latest 5 orders
      .map((order) => ({
        id: order.id,
        type: "income" as const,
        amount: `GHS ${(order.totalCost || 0).toFixed(2)}`,
        description: order.items.length === 1 
          ? order.items[0].name 
          : `${order.items[0].name} + ${order.items.length - 1} more`,
        time: getTimeAgo(order.createdAt || new Date()),
        category: order.paymentType || "Unknown",
        status: order.status || "pending",
      }))
  }, [orders])

  const totalIncome = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount.replace("GHS ", ""))
      return sum + amount
    }, 0)
  }, [transactions])

  function getTimeAgo(date: Date | string): string {
    const now = new Date()
    const orderDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    return orderDate.toLocaleDateString()
  }

  return (
    <div className="dark:text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
          <TrendingUp className="w-3 h-3 text-green-600" />
          <span className="text-xs font-semibold text-green-800">GHS {totalIncome.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-transparent hover:border-green-200 transition-all duration-200 dark:bg-transparent dark:text-white dark:border-0"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg border ${
                  transaction.type === "income"
                    ? "bg-green-100 text-green-600 border-green-200"
                    : "bg-red-100 text-red-600 border-red-200"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">{transaction.description}</p>
                <div className="flex items-center space-x-1 mt-0.5 dark:text-white ">
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                    {transaction.category}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                    {transaction.status}
                  </span>
                  <span className="text-xs text-gray-500">{transaction.time}</span>
                </div>
              </div>
            </div>
            <span className={`font-bold text-sm ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {transaction.type === "income" ? "+" : "-"}
              {transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
