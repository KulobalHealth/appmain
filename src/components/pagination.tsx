"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 4
    const range = []
    const rangeWithDots = []

    // Always show first page
    rangeWithDots.push(1)

    // Calculate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    // Add dots if there's a gap after page 1
    if (currentPage - delta > 2) {
      rangeWithDots.push("...")
    }

    // Add the range
    rangeWithDots.push(...range)

    // Add dots if there's a gap before last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...")
    }

    // Always show last page (if different from first)
    if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === "..." ? (
            <span className="px-2 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === page ? "bg-emerald-600 text-white" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      <button
        className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
