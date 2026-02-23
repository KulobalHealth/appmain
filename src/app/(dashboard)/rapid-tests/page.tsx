"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import TableHeaderComponent from "@/components/dashbord/table-header"
import RapidTestTable from "@/components/dashbord/rapid-test-table"

export default function RapidTests() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className="w-full min-h-screen  dark:bg-background py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <TableHeaderComponent
            handleSearch={handleSearch}
            title="Rapid Test Management"
            text="Manage and track rapid test results efficiently"
            component={
              <Button
                className="bg-green-600 hover:bg-green-700 text-white w-[200px] hidden"
                onClick={() => router.push("/rapid-tests/add-new-test")}
              >
                <User className="h-4 w-4 mr-2" />
                Add New Test
              </Button>
            }
          />

          <RapidTestTable searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  )
}
