"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, MoreHorizontal, Eye, Plus, Edit, Trash2, FileText } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { rapidTestsData } from "@/lib/rapid-tests"
import AddRapidTestDialog from "@/components/add-rapid-test-dialog"

interface RapidTestTableProps {
  searchTerm: string
}

const ITEMS_PER_PAGE = 8

export default function RapidTestTable({ searchTerm }: RapidTestTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredData = rapidTestsData.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.conductedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedTests = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      normal: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      elevated: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      "borderline high": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      abnormal: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    }

    const normalizedStatus = status.toLowerCase()
    return statusColors[normalizedStatus] || "bg-gray-100 text-gray-800 dark:bg-background/20 dark:text-gray-400"
  }

  const getTestTypeColor = (testType: string) => {
    const testColors: Record<string, string> = {
      "blood glucose": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
      "blood pressure": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      cholesterol: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "blood sugar": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      hemoglobin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      "urine test": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      ecg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      "thyroid function": "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
    }

    const normalizedType = testType.toLowerCase()
    return testColors[normalizedType] || "bg-gray-100 text-gray-800 dark:bg-background/20 dark:text-gray-400"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "routine":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-background/20 dark:text-gray-400"
    }
  }

//   const handleAddTest = (data: any) => {
//     console.log("New test data:", data)
//     // Here you would typically send the data to your backend
//   }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      {/* Add Test Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Test
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-background rounded-xl border border-green-200 dark:border-green-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50 dark:bg-green-950/50 hover:bg-green-50 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800">
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Patient</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Test Type</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Results</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Date</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Status</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Conducted By</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTests.length > 0 ? (
              paginatedTests.map((test, index) => (
                <TableRow
                  key={`${test.id}-${index}`}
                  className="hover:bg-green-50/50 dark:hover:bg-green-950/20 border-green-100 dark:border-green-900/50 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-green-200 dark:border-green-700">
                        <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium">
                          {test.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{test.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: #{test.patientId?.toString().padStart(4, "0")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTestTypeColor(test.testType)}>
                      {test.testType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 font-mono text-sm font-medium">
                    {test.results}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{test.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.priority && (
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(test.priority)}`}>
                          {test.priority}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{test.conductedBy}</TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-500 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-300"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 px-2 py-1 mb-1">
                          Test Actions
                        </div>
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Test
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Reorder Test
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Test
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-2">
                    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No rapid tests found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-background px-6 py-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <span>Showing</span>
            <span className="font-medium text-green-700 dark:text-green-400">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>
            <span>to</span>
            <span className="font-medium text-green-700 dark:text-green-400">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
            </span>
            <span>of</span>
            <span className="font-medium text-green-700 dark:text-green-400">{filteredData.length}</span>
            <span>tests</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className={
                      pageNum === currentPage
                        ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                        : "border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"
                    }
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Test Dialog */}
      <AddRapidTestDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}  />
    </div>
  )
}
