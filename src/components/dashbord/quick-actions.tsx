import type React from "react"

interface QuickActionsProps {
  text: string
  icon: React.ReactNode
  color?: string
  description?: string
}

export function QuickActions({
  text,
  icon,
  color = "bg-green-100 hover:bg-green-200 text-green-800",
  description,
}: QuickActionsProps) {
  return (
    <button
      className={`${color} dark:bg-transparent dark:border-gray-800 dark:text-white  rounded-xl p-4 flex flex-col items-start space-y-2 transition-all duration-300 hover:scale-105 w-full text-left border-2 border-transparent hover:border-green-300`}
    >
      <div className="p-2 bg-white rounded-lg border-2 border-green-200 dark:bg-transparent">{icon}</div>
      <div>
        <h3 className="font-bold text-base mb-0.5">{text}</h3>
        {description && <p className="text-sm opacity-80">{description}</p>}
      </div>
    </button>
  )
}
