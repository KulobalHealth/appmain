"use client"
import PatientRegistration from "@/components/dashbord/add-patients"
import type React from "react"

import { useState, useEffect } from "react"
import TableHeaderComponent from "@/components/dashbord/table-header"
import PatientTable from "@/components/dashbord/patients"
import { usePatientStore } from "@/store/patient-store"


export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("")
  const { fetchPatients } = usePatientStore()

  useEffect(() => {
    console.log("[PatientsPage] useEffect - Calling fetchPatients")
    fetchPatients()
  }, [fetchPatients])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="space-y-6">
        <TableHeaderComponent
          handleSearch={handleSearch}
          title="Patient Management"
          text="Manage your patients effectively and track their medical records"
          component={<PatientRegistration />}
        />

        <PatientTable searchTerm={searchTerm} />
      </div>
    </div>
  )
}
