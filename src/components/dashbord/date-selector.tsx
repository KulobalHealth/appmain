"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InteractiveDatePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const selectDate = (date: Date) => {
    setSelectedDate(date)
    setIsOpen(false)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-green-100 dark:bg-background dark:border-gray-700 hover:bg-green-200 border border-green-200 hover:border-green-300 rounded-lg px-3 py-1.5 transition-all duration-300 "
      >
        <Calendar className="w-4 h-4 text-green-700 dark:text-white " />
        <span className="text-xs font-medium text-green-800 dark:text-white">{formatDate(selectedDate)}</span>
      </button> 

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border-2 border-green-100 rounded-2xl p-6 z-50 min-w-80  dark:border-gray-700 dark:bg-background dark:text-white">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-green-100 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 text-green-700 dark:text-white" />
            </Button>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-green-100 rounded-xl"
            >
              <ChevronRight className="w-4 h-4 text-green-700 dark:text-white" />
            </Button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2 dark:text-white">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 ">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="aspect-square">
                {date && (
                  <button
                    onClick={() => selectDate(date)}
                    className={`w-full h-full rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSelected(date)
                        ? "bg-green-600 text-white"
                        : isToday(date)
                          ? "bg-green-100 text-green-800 border-2 border-green-300 dark:text-white dark:border-0"
                          : "hover:bg-green-50 text-gray-700 dark:text-white"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-4 border-t-2 border-green-100">
            <Button
              onClick={() => selectDate(new Date())}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-2"
            >
              Today
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
