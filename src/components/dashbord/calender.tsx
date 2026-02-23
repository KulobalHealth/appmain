import { CalendarIcon } from "lucide-react"

export default function Calendar() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2 dark:bg-transparent">
      <CalendarIcon className="w-5 h-5 text-green-600" />
      <span className="text-sm font-medium text-green-800">{formattedDate}</span>
    </div>
  )
}
