"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, UserRound, MoreHorizontal, Eye, Plus, Edit, Trash2, Phone, AlertTriangle, Activity, Pill, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePatientStore, type Patient } from "@/store/patient-store"
import { useMedicationStore, type Medication } from "@/store/medication-store"
import { useAllergyStore, type Allergy } from "@/store/allergy-store"
import { useConditionStore, type Condition } from "@/store/condition-store"
import toast from "react-hot-toast"
import { PatientHeader } from "./patient-details/patient-header"
import { PatientInfoCard } from "./patient-details/patient-info-card"
import { ContactInfoCard } from "./patient-details/contact-info-card"
import { MedicalInfoCard } from "./patient-details/medical-info-card"
import { HealthRecordsCard } from "./patient-details/health-records-card"
import { DDIRiskSummary, demoRisks } from "./patient-details/ddi-risk-summary"

interface PatientTableProps {
  searchTerm: string
}

const ITEMS_PER_PAGE = 8

export default function PatientTable({ searchTerm }: PatientTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [openActionsPatientId, setOpenActionsPatientId] = useState<string | null>(null)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null)
  const [updateFormData, setUpdateFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    patientType: "normal" as "chronic" | "normal",
    location: "",
    telephone: "",
    email: "",
  })
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false)
  const [showAddMedicalConditionModal, setShowAddMedicalConditionModal] = useState(false)
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false)
  const [allergyFormData, setAllergyFormData] = useState({
    allergyName: "",
    allergyDescription: "",
    allergySeverity: "low" as "low" | "medium" | "high",
    allergyType: "other" as "food" | "environment" | "medication" | "other",
    allergyReaction: "other" as "skin" | "respiratory" | "digestive" | "other",
    medicallyVerified: false,
    reportedBy: "patient" as "patient" | "doctor" | "pharmacist" | "system",
    status: "active" as "active" | "inactive" | "resolved",
    onsetDate: "",
  })
  const [allergyFormErrors, setAllergyFormErrors] = useState<Record<string, string>>({})
  const [medicalConditionFormData, setMedicalConditionFormData] = useState({
    diseaseName: "",
    diseaseCode: "",
    category: "",
    severity: "mild" as "mild" | "moderate" | "severe",
    chronic: false,
    diagnosedDate: "",
    status: "active" as "active" | "inactive" | "resolved",
    diagnosedBy: "",
    notes: "",
  })
  const [medicalConditionFormErrors, setMedicalConditionFormErrors] = useState<Record<string, string>>({})
  const [medicationFormData, setMedicationFormData] = useState({
    medicationName: "",
    genericName: "",
    drugCode: "",
    dosage: "",
    route: "oral" as "oral" | "iv" | "im" | "topical",
    frequency: "",
    indication: "",
    startDate: "",
    endDate: "",
    status: "active" as "active" | "completed" | "stopped" | "on-hold",
    prescribedBy: "",
    verifiedByPharmacist: false,
    notes: "",
  })
  const [medicationFormErrors, setMedicationFormErrors] = useState<Record<string, string>>({})
  const { patients, fetchPatients, deletePatient, updatePatient, isLoading, fetchPatientById } = usePatientStore()
  const { addMedication, isLoading: isMedicationLoading } = useMedicationStore()
  const { addAllergy, isLoading: isAllergyLoading } = useAllergyStore()
  const { addCondition, isLoading: isConditionLoading } = useConditionStore()

  // Validation function for allergies
  const validateAllergyForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!allergyFormData.allergyName.trim()) errors.allergyName = "Allergy name is required"
    if (!allergyFormData.allergyDescription.trim()) errors.allergyDescription = "Allergy description is required"
    if (!allergyFormData.onsetDate) errors.onsetDate = "Onset date is required"
    
    // Date validation
    if (allergyFormData.onsetDate) {
      const onsetDate = new Date(allergyFormData.onsetDate)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      if (onsetDate > today) {
        errors.onsetDate = "Onset date cannot be in the future"
      }
    }
    
    setAllergyFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle allergy form submission
  const handleAddAllergy = async () => {
    if (!selectedPatient?.id) {
      toast.error("No patient selected")
      return
    }

    if (!validateAllergyForm()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    const allergyPayload: Omit<Allergy, "id" | "createdAt" | "updatedAt"> = {
      pharmacyId: "", // Will be set in the store
      patientUuid: selectedPatient.id,
      allergyName: allergyFormData.allergyName,
      allergyDescription: allergyFormData.allergyDescription,
      allergySeverity: allergyFormData.allergySeverity,
      allergyType: allergyFormData.allergyType,
      allergyReaction: allergyFormData.allergyReaction,
      medicallyVerified: allergyFormData.medicallyVerified,
      reportedBy: allergyFormData.reportedBy,
      status: allergyFormData.status,
      onsetDate: new Date(allergyFormData.onsetDate).toISOString(),
    }

    const result = await addAllergy(allergyPayload)
    
    if (result.success) {
      toast.success("Allergy added successfully")
      setAllergyFormData({
        allergyName: "",
        allergyDescription: "",
        allergySeverity: "low",
        allergyType: "other",
        allergyReaction: "other",
        medicallyVerified: false,
        reportedBy: "patient",
        status: "active",
        onsetDate: "",
      })
      setAllergyFormErrors({})
      setShowAddAllergyModal(false)
    } else {
      toast.error(result.error || "Failed to add allergy")
    }
  }

  // Validation function
  const validateMedicationForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!medicationFormData.medicationName.trim()) errors.medicationName = "Medication name is required"
    if (!medicationFormData.genericName.trim()) errors.genericName = "Generic name is required"
    if (!medicationFormData.drugCode.trim()) errors.drugCode = "Drug code is required"
    if (!medicationFormData.dosage.trim()) errors.dosage = "Dosage is required"
    if (!medicationFormData.frequency.trim()) errors.frequency = "Frequency is required"
    if (!medicationFormData.indication.trim()) errors.indication = "Indication is required"
    if (!medicationFormData.startDate) errors.startDate = "Start date is required"
    if (!medicationFormData.endDate) errors.endDate = "End date is required"
    if (!medicationFormData.prescribedBy.trim()) errors.prescribedBy = "Prescribed by is required"
    if (!medicationFormData.notes.trim()) errors.notes = "Notes is required"
    
    // Date validation
    if (medicationFormData.startDate && medicationFormData.endDate) {
      const start = new Date(medicationFormData.startDate)
      const end = new Date(medicationFormData.endDate)
      if (start > end) {
        errors.endDate = "End date must be after or equal to start date"
      }
    }
    
    setMedicationFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle medication form submission
  const handleAddMedication = async () => {
    if (!selectedPatient?.id) {
      toast.error("No patient selected")
      return
    }

    if (!validateMedicationForm()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    const medicationPayload: Omit<Medication, "id" | "createdAt" | "updatedAt"> = {
      pharmacyId: "", // Will be set in the store
      patientUuid: selectedPatient.id,
      medicationName: medicationFormData.medicationName,
      genericName: medicationFormData.genericName,
      drugCode: medicationFormData.drugCode,
      dosage: medicationFormData.dosage,
      route: medicationFormData.route,
      frequency: medicationFormData.frequency,
      indication: medicationFormData.indication,
      startDate: new Date(medicationFormData.startDate).toISOString(),
      endDate: new Date(medicationFormData.endDate).toISOString(),
      status: medicationFormData.status,
      prescribedBy: medicationFormData.prescribedBy,
      verifiedByPharmacist: medicationFormData.verifiedByPharmacist,
      notes: medicationFormData.notes,
    }

    const result = await addMedication(medicationPayload)
    
    if (result.success) {
      toast.success("Medication added successfully")
      setMedicationFormData({
        medicationName: "",
        genericName: "",
        drugCode: "",
        dosage: "",
        route: "oral",
        frequency: "",
        indication: "",
        startDate: "",
        endDate: "",
        status: "active",
        prescribedBy: "",
        verifiedByPharmacist: false,
        notes: "",
      })
      setMedicationFormErrors({})
      setShowAddMedicationModal(false)
    } else {
      toast.error(result.error || "Failed to add medication")
    }
  }

  // Validation function for medical conditions
  const validateConditionForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!medicalConditionFormData.diseaseName.trim()) errors.diseaseName = "Disease name is required"
    if (!medicalConditionFormData.diseaseCode.trim()) errors.diseaseCode = "Disease code is required"
    if (!medicalConditionFormData.category.trim()) errors.category = "Category is required"
    if (!medicalConditionFormData.diagnosedDate) errors.diagnosedDate = "Diagnosed date is required"
    if (!medicalConditionFormData.diagnosedBy.trim()) errors.diagnosedBy = "Diagnosed by is required"
    
    // Date validation
    if (medicalConditionFormData.diagnosedDate) {
      const diagnosedDate = new Date(medicalConditionFormData.diagnosedDate)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      if (diagnosedDate > today) {
        errors.diagnosedDate = "Diagnosed date cannot be in the future"
      }
    }
    
    setMedicalConditionFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle condition form submission
  const handleAddCondition = async () => {
    if (!selectedPatient?.id) {
      toast.error("No patient selected")
      return
    }

    if (!validateConditionForm()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    const conditionPayload: Omit<Condition, "id" | "createdAt" | "updatedAt"> = {
      pharmacyId: "", // Will be set in the store
      patientUuid: selectedPatient.id,
      diseaseName: medicalConditionFormData.diseaseName,
      diseaseCode: medicalConditionFormData.diseaseCode,
      category: medicalConditionFormData.category,
      severity: medicalConditionFormData.severity,
      chronic: medicalConditionFormData.chronic,
      diagnosedDate: new Date(medicalConditionFormData.diagnosedDate).toISOString(),
      status: medicalConditionFormData.status,
      diagnosedBy: medicalConditionFormData.diagnosedBy,
      notes: medicalConditionFormData.notes || "",
    }

    const result = await addCondition(conditionPayload)
    
    if (result.success) {
      toast.success("Medical condition added successfully")
      setMedicalConditionFormData({
        diseaseName: "",
        diseaseCode: "",
        category: "",
        severity: "mild",
        chronic: false,
        diagnosedDate: "",
        status: "active",
        diagnosedBy: "",
        notes: "",
      })
      setMedicalConditionFormErrors({})
      setShowAddMedicalConditionModal(false)
    } else {
      toast.error(result.error || "Failed to add medical condition")
    }
  }

  useEffect(() => {
    console.log("[PatientTable] useEffect - Calling fetchPatients")
    fetchPatients()
  }, [fetchPatients])

  useEffect(() => {
    console.log("[PatientTable] patients from store:", patients)
    console.log("[PatientTable] patients length:", patients.length)
  }, [patients])

  const filteredData = patients.filter(
    (patient) => {
      const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase()
      const location = (patient.location || "").toLowerCase()
      const telephone = (patient.telephone || "").toLowerCase()
      const patientType = (patient.patientType || "").toLowerCase()
      const search = searchTerm.toLowerCase()
      
      return (
        fullName.includes(search) ||
        location.includes(search) ||
        telephone.includes(search) ||
        patientType.includes(search)
      )
    }
  )

  console.log("[PatientTable] filteredData:", filteredData)
  console.log("[PatientTable] filteredData length:", filteredData.length)
  console.log("[PatientTable] searchTerm:", searchTerm)

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedPatients = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  
  console.log("[PatientTable] paginatedPatients:", paginatedPatients)
  console.log("[PatientTable] paginatedPatients length:", paginatedPatients.length)
  console.log("[PatientTable] currentPage:", currentPage)
  console.log("[PatientTable] totalPages:", totalPages)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Helper functions for safe patient data access
  const getPatientInitials = (patient: Patient | null): string => {
    if (!patient) return "?"
    const first = patient.firstName?.trim()?.[0]?.toUpperCase() || ""
    const last = patient.lastName?.trim()?.[0]?.toUpperCase() || ""
    return first + last || "?"
  }

  const getPatientFullName = (patient: Patient | null): string => {
    if (!patient) return "Unknown Patient"
    const first = patient.firstName?.trim() || ""
    const last = patient.lastName?.trim() || ""
    return `${first} ${last}`.trim() || "Unknown Patient"
  }

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "N/A"
      return date.toLocaleDateString()
    } catch {
      return "N/A"
    }
  }

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "female":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      default:
        return "bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-300"
    }
  }

  const getConditionColor = (condition: string) => {
    const conditionColors: Record<string, string> = {
      asthma: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      diabetes: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      hypertension: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      migraine: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      arthritis: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      allergies: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
      anxiety: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      depression: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",
      insomnia: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400",
    }

    const normalizedCondition = condition.toLowerCase().replace(/\s+/g, "")
    return (
      conditionColors[normalizedCondition] || "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    )
  }

  const handleViewDetails = async (patient: Patient) => {
    console.log("[PatientTable] handleViewDetails - Patient:", patient)
    console.log("[PatientTable] handleViewDetails - Patient ID:", patient.id)
    
    // Always try to fetch fresh data if we have an ID
    if (patient.id) {
      console.log("[PatientTable] handleViewDetails - Fetching full patient data for ID:", patient.id)
      try {
        const fullPatient = await fetchPatientById(patient.id)
        console.log("[PatientTable] handleViewDetails - Fetched patient:", fullPatient)
        
        if (fullPatient) {
          console.log("[PatientTable] handleViewDetails - Setting fetched patient:", fullPatient)
          setSelectedPatient(fullPatient)
        } else {
          console.warn("[PatientTable] handleViewDetails - fetchPatientById returned null, using provided patient")
    setSelectedPatient(patient)
        }
      } catch (error) {
        console.error("[PatientTable] handleViewDetails - Error fetching patient:", error)
        // Fallback to the patient data we already have
        setSelectedPatient(patient)
      }
    } else {
      console.log("[PatientTable] handleViewDetails - No patient ID, using provided patient directly")
    setSelectedPatient(patient)
    }
    setOpenActionsPatientId(null)
  }

  const handleEditPatient = (patient: Patient) => {
    setEditPatient(patient)
    setUpdateFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      patientType: patient.patientType,
      location: patient.location,
      telephone: patient.telephone,
      email: patient.email || "",
    })
    setOpenActionsPatientId(null)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowUpdateConfirm(true)
  }

  const confirmUpdate = async () => {
    if (!editPatient?.id) return

    const result = await updatePatient(editPatient.id, {
      firstName: updateFormData.firstName,
      lastName: updateFormData.lastName,
      dateOfBirth: updateFormData.dateOfBirth,
      patientType: updateFormData.patientType,
      location: updateFormData.location,
      telephone: updateFormData.telephone,
      email: updateFormData.email || null,
    })

    if (result.success) {
      toast.success("Patient updated successfully")
      setEditPatient(null)
      setShowUpdateConfirm(false)
      if (selectedPatient?.id === editPatient.id) {
        await fetchPatientById(editPatient.id)
      }
    } else {
      toast.error(result.error || "Failed to update patient")
    }
  }

  const handleDeleteClick = (patientId: string) => {
    setPatientToDelete(patientId)
    setShowDeleteConfirm(true)
    setOpenActionsPatientId(null)
  }

  const confirmDelete = async () => {
    if (!patientToDelete) return

    const result = await deletePatient(patientToDelete)
    if (result.success) {
      toast.success("Patient deleted successfully")
      setShowDeleteConfirm(false)
      setPatientToDelete(null)
      if (selectedPatient?.id === patientToDelete) {
        setSelectedPatient(null)
      }
    } else {
      toast.error(result.error || "Failed to delete patient")
    }
  }

  const handleCloseDetails = () => {
    setSelectedPatient(null)
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      {!selectedPatient && (
        <>
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 text-base mt-4">Loading patients...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
      <div className="bg-white dark:bg-background rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50/80 dark:bg-gray-900/50 hover:bg-gray-50/80 dark:hover:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-sm py-4 px-6">Patient</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-sm py-4 px-4">Date of Birth</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-sm py-4 px-4">Gender</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-sm py-4 px-4">Contact</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-sm py-4 px-4">Type</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-sm py-4 px-4">Last Visit</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-sm py-4 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((patient) => (
                <TableRow
                  key={patient.id || `${patient.firstName}-${patient.lastName}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800/50 transition-colors"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-800">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold text-sm">
                          {getPatientInitials(patient)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {getPatientFullName(patient)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{patient.email || "No email"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-gray-600 dark:text-gray-300 text-sm">
                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${patient.gender === "male" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : patient.gender === "female" ? "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                      {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-gray-600 dark:text-gray-300 text-sm">
                    {patient.telephone || "—"}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${patient.patientType === "chronic" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
                      {patient.patientType ? patient.patientType.charAt(0).toUpperCase() + patient.patientType.slice(1) : "Normal"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-gray-500 dark:text-gray-400 text-sm">—</TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <Popover open={openActionsPatientId === patient.id} onOpenChange={(o)=> setOpenActionsPatientId(o ? patient.id || null : null)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl" align="end">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                          Actions
                        </div>
                        <div className="space-y-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-9 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-normal"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <Eye className="h-4 w-4 mr-3 text-gray-500" />
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-9 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-normal"
                            onClick={() => setShowAddAllergyModal(true)}
                          >
                            <Plus className="h-4 w-4 mr-3 text-gray-500" />
                            Add Allergy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-9 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-normal"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit className="h-4 w-4 mr-3 text-gray-500" />
                            Edit Patient
                          </Button>
                          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                          {patient.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-9 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-normal"
                              onClick={() => patient.id && handleDeleteClick(patient.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete Patient
                          </Button>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <UserRound className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">No patients found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search criteria</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span>Showing</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>
            <span>to</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
            </span>
            <span>of</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{filteredData.length}</span>
            <span>patients</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 h-9 px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-1">
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
                    className={`h-9 w-9 p-0 ${
                      pageNum === currentPage
                        ? "bg-gray-900 hover:bg-gray-800 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
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
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 h-9 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        )}
      </div>
      )}
        </>
      )}
      {selectedPatient && (() => {
        console.log("[PatientTable] Rendering patient details - selectedPatient:", selectedPatient)
        // Safe accessors with fallbacks
        const firstName = selectedPatient.firstName || ""
        const lastName = selectedPatient.lastName || ""
        const fullName = getPatientFullName(selectedPatient)
        const initials = getPatientInitials(selectedPatient)
        const patientType = selectedPatient.patientType || "normal"
        const formattedDob = formatDate(selectedPatient.dateOfBirth)
        const telephone = selectedPatient.telephone || "N/A"
        const email = selectedPatient.email || "N/A"
        const location = selectedPatient.location || "N/A"
        const patientId = selectedPatient.id || "N/A"
        
        console.log("[PatientTable] Patient details - fullName:", fullName, "telephone:", telephone, "location:", location)

        return (
        <div className="bg-white dark:bg-background rounded-xl border border-green-200 dark:border-green-800 shadow-sm overflow-hidden w-full">
          <PatientHeader
            patient={selectedPatient}
            initials={initials}
            fullName={fullName}
            patientType={patientType}
            onBack={handleCloseDetails}
            onAddAllergy={() => setShowAddAllergyModal(true)}
            onAddMedicalCondition={() => setShowAddMedicalConditionModal(true)}
            onAddMedication={() => setShowAddMedicationModal(true)}
          />

          {/* DDI Risk Summary - Shows at top when risks exist */}
          <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
            <DDIRiskSummary 
              risks={demoRisks} 
              patientName={fullName}
              onRunAnalysis={() => {
                // TODO: Connect to actual DDI analysis API
                console.log("Running DDI analysis for patient:", selectedPatient.id)
              }}
            />
          </div>

          {/* Two-column content matching attached design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 w-full">
            {/* Left: Patient Information */}
            <div className="space-y-4 md:space-y-5">
              <PatientInfoCard
                patientId={patientId}
                formattedDob={formattedDob}
                patientType={patientType}
                location={location}
              />

              <ContactInfoCard
                telephone={telephone}
                email={email}
                location={location}
              />

              <MedicalInfoCard patientUuid={selectedPatient.id} />
              </div>

            {/* Right: Health Records */}
            <HealthRecordsCard patientUuid={selectedPatient.id} />
            </div>
            </div>
        )
      })()}

      {/* Update Patient Modal */}
      <Dialog open={!!editPatient} onOpenChange={(open) => !open && setEditPatient(null)}>
        <DialogContent className="min-w-[800px] max-h-[90vh] overflow-y-auto p-5 scrollbar-hide">
          <DialogHeader className="px-8 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl font-semibold">Update Patient</DialogTitle>
            <DialogDescription>Update patient information</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="px-8 py-6 space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-emerald-600">Patient Information</h3>
              <p className="text-sm text-muted-foreground">Update patient details</p>
          </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName" className="text-sm font-medium">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-firstName"
                    placeholder="Enter first name"
                    className="h-11"
                    value={updateFormData.firstName}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName" className="text-sm font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-lastName"
                    placeholder="Enter last name"
                    className="h-11"
                    value={updateFormData.lastName}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, lastName: e.target.value })}
                    required
                  />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dob" className="text-sm font-medium">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    className="h-11"
                    value={updateFormData.dateOfBirth}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-patientType" className="text-sm font-medium">
                    Patient Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={updateFormData.patientType}
                    onValueChange={(value: "chronic" | "normal") => setUpdateFormData({ ...updateFormData, patientType: value })}
                  >
                    <SelectTrigger id="edit-patientType" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="chronic">Chronic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
              </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-medium">
                    Email (Optional)
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Enter email"
                    className="h-11"
                    value={updateFormData.email}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, email: e.target.value })}
                  />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-telephone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center gap-1 px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm h-11">
                      <span className="text-base">🇬🇭</span>
                      <span>+233</span>
                    </span>
                    <Input
                      id="edit-telephone"
                      placeholder="eg. 201234567"
                      className="rounded-l-none h-11"
                      value={updateFormData.telephone}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, telephone: e.target.value })}
                      required
                    />
                  </div>
                  </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-location" className="text-sm font-medium">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-location"
                    placeholder="Enter patient location (e.g., Accra, GH)"
                    className="h-11"
                    value={updateFormData.location}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </form>

          <DialogFooter className="px-8 py-4 border-t gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-6 bg-transparent"
              onClick={() => setEditPatient(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateSubmit}
              className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Patient"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Confirmation Modal */}
      <Dialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this patient's information? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? "Updating..." : "Confirm Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient? This action cannot be undone and all patient data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
              {isLoading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Allergy Modal */}
      <Dialog open={showAddAllergyModal} onOpenChange={(open) => {
        setShowAddAllergyModal(open)
        if (!open) {
          setAllergyFormErrors({})
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Add Allergy</DialogTitle>
            <DialogDescription>
              Add a new allergy for {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "this patient"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddAllergy() }} className="space-y-6 py-4">
            {/* Row 1: Allergy Name */}
            <div className="space-y-2">
              <Label htmlFor="allergyName">Allergy Name <span className="text-red-500">*</span></Label>
              <Input
                id="allergyName"
                placeholder="e.g., Peanuts, Penicillin, Latex"
                value={allergyFormData.allergyName}
                onChange={(e) => {
                  setAllergyFormData({ ...allergyFormData, allergyName: e.target.value })
                  if (allergyFormErrors.allergyName) {
                    setAllergyFormErrors({ ...allergyFormErrors, allergyName: "" })
                  }
                }}
                className={allergyFormErrors.allergyName ? "border-red-500" : ""}
                required
              />
              {allergyFormErrors.allergyName && (
                <p className="text-xs text-red-500">{allergyFormErrors.allergyName}</p>
              )}
                    </div>

            {/* Row 2: Allergy Description */}
            <div className="space-y-2">
              <Label htmlFor="allergyDescription">Allergy Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="allergyDescription"
                placeholder="Describe the allergy and its effects..."
                value={allergyFormData.allergyDescription}
                onChange={(e) => {
                  setAllergyFormData({ ...allergyFormData, allergyDescription: e.target.value })
                  if (allergyFormErrors.allergyDescription) {
                    setAllergyFormErrors({ ...allergyFormErrors, allergyDescription: "" })
                  }
                }}
                className={allergyFormErrors.allergyDescription ? "border-red-500" : ""}
                rows={3}
                required
              />
              {allergyFormErrors.allergyDescription && (
                <p className="text-xs text-red-500">{allergyFormErrors.allergyDescription}</p>
              )}
                  </div>

            {/* Row 3: Allergy Severity & Allergy Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="allergySeverity">Allergy Severity <span className="text-red-500">*</span></Label>
                <Select
                  value={allergyFormData.allergySeverity}
                  onValueChange={(value: "low" | "medium" | "high") => {
                    setAllergyFormData({ ...allergyFormData, allergySeverity: value })
                    if (allergyFormErrors.allergySeverity) {
                      setAllergyFormErrors({ ...allergyFormErrors, allergySeverity: "" })
                    }
                  }}
                >
                  <SelectTrigger className={allergyFormErrors.allergySeverity ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select severity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {allergyFormErrors.allergySeverity && (
                  <p className="text-xs text-red-500">{allergyFormErrors.allergySeverity}</p>
                )}
                    </div>
              <div className="space-y-2">
                <Label htmlFor="allergyType">Allergy Type <span className="text-red-500">*</span></Label>
                <Select
                  value={allergyFormData.allergyType}
                  onValueChange={(value: "food" | "environment" | "medication" | "other") => {
                    setAllergyFormData({ ...allergyFormData, allergyType: value })
                    if (allergyFormErrors.allergyType) {
                      setAllergyFormErrors({ ...allergyFormErrors, allergyType: "" })
                    }
                  }}
                >
                  <SelectTrigger className={allergyFormErrors.allergyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {allergyFormErrors.allergyType && (
                  <p className="text-xs text-red-500">{allergyFormErrors.allergyType}</p>
                )}
                  </div>
            </div>

            {/* Row 4: Allergy Reaction & Reported By */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="allergyReaction">Allergy Reaction <span className="text-red-500">*</span></Label>
                <Select
                  value={allergyFormData.allergyReaction}
                  onValueChange={(value: "skin" | "respiratory" | "digestive" | "other") => {
                    setAllergyFormData({ ...allergyFormData, allergyReaction: value })
                    if (allergyFormErrors.allergyReaction) {
                      setAllergyFormErrors({ ...allergyFormErrors, allergyReaction: "" })
                    }
                  }}
                >
                  <SelectTrigger className={allergyFormErrors.allergyReaction ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select reaction..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skin">Skin</SelectItem>
                    <SelectItem value="respiratory">Respiratory</SelectItem>
                    <SelectItem value="digestive">Digestive</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {allergyFormErrors.allergyReaction && (
                  <p className="text-xs text-red-500">{allergyFormErrors.allergyReaction}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportedBy">Reported By <span className="text-red-500">*</span></Label>
                <Select
                  value={allergyFormData.reportedBy}
                  onValueChange={(value: "patient" | "doctor" | "pharmacist" | "system") => {
                    setAllergyFormData({ ...allergyFormData, reportedBy: value })
                    if (allergyFormErrors.reportedBy) {
                      setAllergyFormErrors({ ...allergyFormErrors, reportedBy: "" })
                    }
                  }}
                >
                  <SelectTrigger className={allergyFormErrors.reportedBy ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select reporter..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                {allergyFormErrors.reportedBy && (
                  <p className="text-xs text-red-500">{allergyFormErrors.reportedBy}</p>
                )}
                </div>
              </div>

            {/* Row 5: Status & Onset Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Select
                  value={allergyFormData.status}
                  onValueChange={(value: "active" | "inactive" | "resolved") => {
                    setAllergyFormData({ ...allergyFormData, status: value })
                    if (allergyFormErrors.status) {
                      setAllergyFormErrors({ ...allergyFormErrors, status: "" })
                    }
                  }}
                >
                  <SelectTrigger className={allergyFormErrors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                {allergyFormErrors.status && (
                  <p className="text-xs text-red-500">{allergyFormErrors.status}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="onsetDate">Onset Date <span className="text-red-500">*</span></Label>
                <Input
                  id="onsetDate"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={allergyFormData.onsetDate}
                  onChange={(e) => {
                    setAllergyFormData({ ...allergyFormData, onsetDate: e.target.value })
                    if (allergyFormErrors.onsetDate) {
                      setAllergyFormErrors({ ...allergyFormErrors, onsetDate: "" })
                    }
                  }}
                  className={allergyFormErrors.onsetDate ? "border-red-500" : ""}
                  required
                />
                {allergyFormErrors.onsetDate && (
                  <p className="text-xs text-red-500">{allergyFormErrors.onsetDate}</p>
                )}
              </div>
            </div>

            {/* Row 6: Medically Verified */}
            <div className="space-y-2">
              <Label htmlFor="medicallyVerified">Medically Verified <span className="text-red-500">*</span></Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="medicallyVerified"
                  checked={allergyFormData.medicallyVerified}
                  onCheckedChange={(checked: boolean) => {
                    setAllergyFormData({ ...allergyFormData, medicallyVerified: checked })
                  }}
                />
                <Label htmlFor="medicallyVerified" className="text-sm font-normal cursor-pointer">
                  This allergy has been medically verified
                </Label>
                </div>
            </div>
          </form>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddAllergyModal(false)
                setAllergyFormErrors({})
              }}
              disabled={isAllergyLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleAddAllergy}
              disabled={isAllergyLoading}
            >
              {isAllergyLoading ? "Adding..." : "Add Allergy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Medical Condition Modal */}
      <Dialog open={showAddMedicalConditionModal} onOpenChange={(open) => {
        setShowAddMedicalConditionModal(open)
        if (!open) {
          setMedicalConditionFormErrors({})
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Add Medical Condition</DialogTitle>
            <DialogDescription>
              Add a new medical condition for {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "this patient"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddCondition() }} className="space-y-6 py-4">
            {/* Row 1: Disease Name & Disease Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diseaseName">Disease Name <span className="text-red-500">*</span></Label>
                <Input
                  id="diseaseName"
                  placeholder="e.g., Type 2 Diabetes, Hypertension"
                  value={medicalConditionFormData.diseaseName}
                  onChange={(e) => {
                    setMedicalConditionFormData({ ...medicalConditionFormData, diseaseName: e.target.value })
                    if (medicalConditionFormErrors.diseaseName) {
                      setMedicalConditionFormErrors({ ...medicalConditionFormErrors, diseaseName: "" })
                    }
                  }}
                  className={medicalConditionFormErrors.diseaseName ? "border-red-500" : ""}
                  required
                />
                {medicalConditionFormErrors.diseaseName && (
                  <p className="text-xs text-red-500">{medicalConditionFormErrors.diseaseName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diseaseCode">Disease Code (ICD-10) <span className="text-red-500">*</span></Label>
                <Input
                  id="diseaseCode"
                  placeholder="e.g., E11.9, I10"
                  value={medicalConditionFormData.diseaseCode}
                  onChange={(e) => {
                    setMedicalConditionFormData({ ...medicalConditionFormData, diseaseCode: e.target.value })
                    if (medicalConditionFormErrors.diseaseCode) {
                      setMedicalConditionFormErrors({ ...medicalConditionFormErrors, diseaseCode: "" })
                    }
                  }}
                  className={medicalConditionFormErrors.diseaseCode ? "border-red-500" : ""}
                  required
                />
                {medicalConditionFormErrors.diseaseCode && (
                  <p className="text-xs text-red-500">{medicalConditionFormErrors.diseaseCode}</p>
                )}
              </div>
            </div>

            {/* Row 2: Category & Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Input
                  id="category"
                  placeholder="e.g., Endocrine and Metabolic, Cardiovascular"
                  value={medicalConditionFormData.category}
                  onChange={(e) => {
                    setMedicalConditionFormData({ ...medicalConditionFormData, category: e.target.value })
                    if (medicalConditionFormErrors.category) {
                      setMedicalConditionFormErrors({ ...medicalConditionFormErrors, category: "" })
                    }
                  }}
                  className={medicalConditionFormErrors.category ? "border-red-500" : ""}
                  required
                />
                {medicalConditionFormErrors.category && (
                  <p className="text-xs text-red-500">{medicalConditionFormErrors.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity <span className="text-red-500">*</span></Label>
                <Select
                  value={medicalConditionFormData.severity}
                  onValueChange={(value: "mild" | "moderate" | "severe") => {
                    setMedicalConditionFormData({ ...medicalConditionFormData, severity: value })
                    if (medicalConditionFormErrors.severity) {
                      setMedicalConditionFormErrors({ ...medicalConditionFormErrors, severity: "" })
                    }
                  }}
                >
                  <SelectTrigger className={medicalConditionFormErrors.severity ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select severity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
                {medicalConditionFormErrors.severity && (
                  <p className="text-xs text-red-500">{medicalConditionFormErrors.severity}</p>
                )}
              </div>
            </div>

            {/* Row 3: Status & Diagnosed Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Select
                  value={medicalConditionFormData.status}
                  onValueChange={(value: "active" | "inactive" | "resolved") => {
                    setMedicalConditionFormData({ ...medicalConditionFormData, status: value })
                    if (medicalConditionFormErrors.status) {
                      setMedicalConditionFormErrors({ ...medicalConditionFormErrors, status: "" })
                    }
                  }}
                >
                  <SelectTrigger className={medicalConditionFormErrors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                {medicalConditionFormErrors.status && (
                  <p className="text-xs text-red-500">{medicalConditionFormErrors.status}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosedDate">Diagnosed Date <span className="text-red-500">*</span></Label>
                <Input
                  id="diagnosedDate"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={medicalConditionFormData.diagnosedDate}
                  onChange={(e) => {
                    setMedicalConditionFormData({ ...medicalConditionFormData, diagnosedDate: e.target.value })
                    if (medicalConditionFormErrors.diagnosedDate) {
                      setMedicalConditionFormErrors({ ...medicalConditionFormErrors, diagnosedDate: "" })
                    }
                  }}
                  className={medicalConditionFormErrors.diagnosedDate ? "border-red-500" : ""}
                  required
                />
                {medicalConditionFormErrors.diagnosedDate && (
                  <p className="text-xs text-red-500">{medicalConditionFormErrors.diagnosedDate}</p>
                )}
              </div>
            </div>

            {/* Row 4: Diagnosed By & Chronic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosedBy">Diagnosed By <span className="text-red-500">*</span></Label>
                <Input
                  id="diagnosedBy"
                  placeholder="e.g., doctor-123, system, clinic"
                  value={medicalConditionFormData.diagnosedBy}
                  onChange={(e) => {
                    setMedicalConditionFormData({ ...medicalConditionFormData, diagnosedBy: e.target.value })
                    if (medicalConditionFormErrors.diagnosedBy) {
                      setMedicalConditionFormErrors({ ...medicalConditionFormErrors, diagnosedBy: "" })
                    }
                  }}
                  className={medicalConditionFormErrors.diagnosedBy ? "border-red-500" : ""}
                  required
                />
                {medicalConditionFormErrors.diagnosedBy && (
                  <p className="text-xs text-red-500">{medicalConditionFormErrors.diagnosedBy}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="chronic">Chronic Condition <span className="text-red-500">*</span></Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="chronic"
                    checked={medicalConditionFormData.chronic}
                    onCheckedChange={(checked: boolean) => {
                      setMedicalConditionFormData({ ...medicalConditionFormData, chronic: checked })
                    }}
                  />
                  <Label htmlFor="chronic" className="text-sm font-normal cursor-pointer">
                    This is a chronic condition
                  </Label>
                </div>
              </div>
            </div>

            {/* Row 5: Notes (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about the condition..."
                value={medicalConditionFormData.notes}
                onChange={(e) => {
                  setMedicalConditionFormData({ ...medicalConditionFormData, notes: e.target.value })
                }}
                rows={3}
              />
            </div>
          </form>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddMedicalConditionModal(false)
                setMedicalConditionFormErrors({})
              }}
              disabled={isConditionLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleAddCondition}
              disabled={isConditionLoading}
            >
              {isConditionLoading ? "Adding..." : "Add Condition"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Medication Modal (Prescription Form) */}
      <Dialog open={showAddMedicationModal} onOpenChange={(open) => {
        setShowAddMedicationModal(open)
        if (!open) {
          setMedicationFormErrors({})
        }
      }}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>
              Create a new prescription for {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "this patient"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddMedication() }} className="space-y-6 py-4">
            {/* Row 1: Medication Name & Generic Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name <span className="text-red-500">*</span></Label>
                <Input
                  id="medicationName"
                  placeholder="e.g., Amoxicillin"
                  value={medicationFormData.medicationName}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, medicationName: e.target.value })
                    if (medicationFormErrors.medicationName) {
                      setMedicationFormErrors({ ...medicationFormErrors, medicationName: "" })
                    }
                  }}
                  className={medicationFormErrors.medicationName ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.medicationName && (
                  <p className="text-xs text-red-500">{medicationFormErrors.medicationName}</p>
                )}
                  </div>
              <div className="space-y-2">
                <Label htmlFor="genericName">Generic Name <span className="text-red-500">*</span></Label>
                <Input
                  id="genericName"
                  placeholder="e.g., Amoxicillin trihydrate"
                  value={medicationFormData.genericName}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, genericName: e.target.value })
                    if (medicationFormErrors.genericName) {
                      setMedicationFormErrors({ ...medicationFormErrors, genericName: "" })
                    }
                  }}
                  className={medicationFormErrors.genericName ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.genericName && (
                  <p className="text-xs text-red-500">{medicationFormErrors.genericName}</p>
                )}
                    </div>
                  </div>

            {/* Row 2: Drug Code & Dosage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drugCode">Drug Code <span className="text-red-500">*</span></Label>
                <Input
                  id="drugCode"
                  placeholder="e.g., AMX-500"
                  value={medicationFormData.drugCode}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, drugCode: e.target.value })
                    if (medicationFormErrors.drugCode) {
                      setMedicationFormErrors({ ...medicationFormErrors, drugCode: "" })
                    }
                  }}
                  className={medicationFormErrors.drugCode ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.drugCode && (
                  <p className="text-xs text-red-500">{medicationFormErrors.drugCode}</p>
                )}
                      </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage <span className="text-red-500">*</span></Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 500mg, 10ml, 2 tablets"
                  value={medicationFormData.dosage}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, dosage: e.target.value })
                    if (medicationFormErrors.dosage) {
                      setMedicationFormErrors({ ...medicationFormErrors, dosage: "" })
                    }
                  }}
                  className={medicationFormErrors.dosage ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.dosage && (
                  <p className="text-xs text-red-500">{medicationFormErrors.dosage}</p>
                )}
                    </div>
            </div>

            {/* Row 3: Route & Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="route">Route <span className="text-red-500">*</span></Label>
                <Select
                  value={medicationFormData.route}
                  onValueChange={(value: "oral" | "iv" | "im" | "topical") => {
                    setMedicationFormData({ ...medicationFormData, route: value })
                    if (medicationFormErrors.route) {
                      setMedicationFormErrors({ ...medicationFormErrors, route: "" })
                    }
                  }}
                >
                  <SelectTrigger className={medicationFormErrors.route ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select route..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="iv">IV (Intravenous)</SelectItem>
                    <SelectItem value="im">IM (Intramuscular)</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                  </SelectContent>
                </Select>
                {medicationFormErrors.route && (
                  <p className="text-xs text-red-500">{medicationFormErrors.route}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency <span className="text-red-500">*</span></Label>
                <Input
                  id="frequency"
                  placeholder="e.g., Twice daily (every 12 hours)"
                  value={medicationFormData.frequency}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, frequency: e.target.value })
                    if (medicationFormErrors.frequency) {
                      setMedicationFormErrors({ ...medicationFormErrors, frequency: "" })
                    }
                  }}
                  className={medicationFormErrors.frequency ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.frequency && (
                  <p className="text-xs text-red-500">{medicationFormErrors.frequency}</p>
                )}
            </div>
          </div>

            {/* Row 4: Indication & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="indication">Indication <span className="text-red-500">*</span></Label>
                <Input
                  id="indication"
                  placeholder="e.g., Bacterial infection"
                  value={medicationFormData.indication}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, indication: e.target.value })
                    if (medicationFormErrors.indication) {
                      setMedicationFormErrors({ ...medicationFormErrors, indication: "" })
                    }
                  }}
                  className={medicationFormErrors.indication ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.indication && (
                  <p className="text-xs text-red-500">{medicationFormErrors.indication}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Select
                  value={medicationFormData.status}
                  onValueChange={(value: "active" | "completed" | "stopped" | "on-hold") => {
                    setMedicationFormData({ ...medicationFormData, status: value })
                    if (medicationFormErrors.status) {
                      setMedicationFormErrors({ ...medicationFormErrors, status: "" })
                    }
                  }}
                >
                  <SelectTrigger className={medicationFormErrors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                {medicationFormErrors.status && (
                  <p className="text-xs text-red-500">{medicationFormErrors.status}</p>
                )}
              </div>
            </div>

            {/* Row 5: Start Date & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  value={medicationFormData.startDate}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, startDate: e.target.value })
                    if (medicationFormErrors.startDate) {
                      setMedicationFormErrors({ ...medicationFormErrors, startDate: "" })
                    }
                  }}
                  className={medicationFormErrors.startDate ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.startDate && (
                  <p className="text-xs text-red-500">{medicationFormErrors.startDate}</p>
                )}
          </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
                <Input
                  id="endDate"
                  type="date"
                  value={medicationFormData.endDate}
                  min={medicationFormData.startDate}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, endDate: e.target.value })
                    if (medicationFormErrors.endDate) {
                      setMedicationFormErrors({ ...medicationFormErrors, endDate: "" })
                    }
                  }}
                  className={medicationFormErrors.endDate ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.endDate && (
                  <p className="text-xs text-red-500">{medicationFormErrors.endDate}</p>
                )}
        </div>
            </div>

            {/* Row 6: Prescribed By & Verified By Pharmacist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prescribedBy">Prescribed By <span className="text-red-500">*</span></Label>
                <Input
                  id="prescribedBy"
                  placeholder="e.g., Dr. John Doe"
                  value={medicationFormData.prescribedBy}
                  onChange={(e) => {
                    setMedicationFormData({ ...medicationFormData, prescribedBy: e.target.value })
                    if (medicationFormErrors.prescribedBy) {
                      setMedicationFormErrors({ ...medicationFormErrors, prescribedBy: "" })
                    }
                  }}
                  className={medicationFormErrors.prescribedBy ? "border-red-500" : ""}
                  required
                />
                {medicationFormErrors.prescribedBy && (
                  <p className="text-xs text-red-500">{medicationFormErrors.prescribedBy}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="verifiedByPharmacist">Verified By Pharmacist <span className="text-red-500">*</span></Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="verifiedByPharmacist"
                    checked={medicationFormData.verifiedByPharmacist}
                    onCheckedChange={(checked: boolean) => {
                      setMedicationFormData({ ...medicationFormData, verifiedByPharmacist: checked })
                    }}
                  />
                  <Label htmlFor="verifiedByPharmacist" className="text-sm font-normal cursor-pointer">
                    Medication verified by pharmacist
                  </Label>
                </div>
              </div>
            </div>

            {/* Row 7: Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes <span className="text-red-500">*</span></Label>
              <Textarea
                id="notes"
                placeholder="Additional instructions or notes..."
                value={medicationFormData.notes}
                onChange={(e) => {
                  setMedicationFormData({ ...medicationFormData, notes: e.target.value })
                  if (medicationFormErrors.notes) {
                    setMedicationFormErrors({ ...medicationFormErrors, notes: "" })
                  }
                }}
                className={medicationFormErrors.notes ? "border-red-500" : ""}
                rows={4}
                required
              />
              {medicationFormErrors.notes && (
                <p className="text-xs text-red-500">{medicationFormErrors.notes}</p>
              )}
            </div>
          </form>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddMedicationModal(false)
                setMedicationFormErrors({})
              }}
              disabled={isMedicationLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleAddMedication}
              disabled={isMedicationLoading}
            >
              {isMedicationLoading ? "Adding..." : "Add Medication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
