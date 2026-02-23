import type React from "react"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: string
  color?: string
}

export default function StatCard({ title, value, description, icon, trend, color = "bg-green-600" }: StatCardProps) {
  const isPositiveTrend = trend?.startsWith("+")

  return (
    <div className="bg-white border-2 border-green-100   dark:bg-transparent dark:text-white dark:border-gray-700 rounded-xl p-4 hover:border-green-300 transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 ${color} rounded-lg text-white`}>{icon}</div>
        {trend && (
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full border-2 ${
              isPositiveTrend ? "text-green-700 bg-green-50 border-green-200 " : "text-red-700 bg-red-50 border-red-200"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide dark:text-white">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-white">{description}</p>
      </div>
    </div>
  )
}
