import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Pill, Activity, Calendar, Eye, Trash2 } from "lucide-react"
import { useMedicationStore, type Medication } from "@/store/medication-store"
import toast from "react-hot-toast"
interface TestResult {
  test: string
  result: string
  date: string
  status: string
}

interface HealthRecordsCardProps {
  patientUuid?: string
  testResults?: TestResult[]
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    case "stopped":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "on-hold":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

// Helper function to format date
const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "N/A"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const day = date.getDate().toString().padStart(2, "0")
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
  } catch {
    return dateString
  }
}

// Helper function to check if medication is current
const isCurrentMedication = (medication: Medication): boolean => {
  if (medication.status === "active") return true
  if (medication.endDate) {
    const endDate = new Date(medication.endDate)
    return endDate >= new Date()
  }
  return false
}

export function HealthRecordsCard({ 
  patientUuid,
  testResults = [
    { test: "Blood Pressure", result: "140/90 mmHg", date: "2025-01-15", status: "High" },
    { test: "Blood Glucose", result: "180 mg/dL", date: "2025-01-15", status: "High" }
  ]
}: HealthRecordsCardProps) {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null)
  const { medications, fetchPatientMedications, isLoading, deleteMedication } = useMedicationStore()

  useEffect(() => {
    if (patientUuid) {
      console.log("[HealthRecordsCard] Fetching medications for patient:", patientUuid)
      fetchPatientMedications(patientUuid)
    }
  }, [patientUuid, fetchPatientMedications])

  // Separate current and past medications based on status and end date
  const currentMedications = medications.filter(m => isCurrentMedication(m))
  const pastMedications = medications.filter(m => !isCurrentMedication(m))

  const handleViewMedication = (medication: Medication) => {
    setSelectedMedication(medication)
  }

  const handleDeleteMedication = async () => {
    if (!medicationToDelete?.id || !patientUuid) {
      toast.error("Unable to delete medication")
      return
    }

    const result = await deleteMedication(medicationToDelete.id, patientUuid)
    
    if (result.success) {
      toast.success("Medication deleted successfully")
      setMedicationToDelete(null)
    } else {
      toast.error(result.error || "Failed to delete medication")
    }
  }

  return (
    <div className="rounded-lg border border-green-100 dark:border-green-900/40 p-3 sm:p-4 md:p-5 bg-white dark:bg-background w-full">
      <div className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Health Records</div>
      <Tabs defaultValue="medications" className="w-full">
        <div className="bg-white dark:bg-background rounded-md border border-gray-200 dark:border-gray-800 mb-4">
          <TabsList className="grid grid-cols-2 w-full h-10 bg-transparent">
            <TabsTrigger value="medications" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md m-1">
              <Pill className="w-4 h-4" /> Medications
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md m-1">
              <Activity className="w-4 h-4" /> Test Results
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="medications" className="space-y-3">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-none border-b border-gray-200 dark:border-gray-800 bg-transparent p-0 mb-4 w-full">
              <TabsTrigger 
                value="current" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 data-[state=active]:font-semibold"
              >
                Current
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 data-[state=active]:font-semibold"
              >
                Past
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-6 text-sm text-muted-foreground">Loading medications...</div>
              ) : currentMedications.length > 0 ? (
                currentMedications.map((m) => (
                  <div key={m.id || m.medicationName} className="bg-gray-50 dark:bg-gray-900/20 rounded-md p-2.5 sm:p-3 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <div className="font-medium text-xs sm:text-sm truncate">{m.medicationName}</div>
                          <Badge variant="outline" className="text-xs w-fit">{m.dosage}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1 sm:mb-2">{m.frequency}</div>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-[10px] sm:text-[11px] text-muted-foreground">
                          <span>Start: {formatDate(m.startDate)}</span>
                          <span className="hidden xs:inline">•</span>
                          <span>End: {formatDate(m.endDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center sm:items-start gap-1 sm:ml-2">
                        <Badge className={`text-xs ${getStatusColor(m.status)}`}>
                          {m.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
                          onClick={() => setMedicationToDelete(m)}
                          title="Delete medication"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-t border-gray-200 dark:border-gray-800 pt-2 mt-2"
                      onClick={() => handleViewMedication(m)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">No current medications</div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-6 text-sm text-muted-foreground">Loading medications...</div>
              ) : pastMedications.length > 0 ? (
                pastMedications.map((m) => (
                  <div key={m.id || m.medicationName} className="bg-gray-50 dark:bg-gray-900/20 rounded-md p-2.5 sm:p-3 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <div className="font-medium text-xs sm:text-sm truncate">{m.medicationName}</div>
                          <Badge variant="outline" className="text-xs w-fit">{m.dosage}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1 sm:mb-2">{m.frequency}</div>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-[10px] sm:text-[11px] text-muted-foreground">
                          <span>Start: {formatDate(m.startDate)}</span>
                          <span className="hidden xs:inline">•</span>
                          <span>End: {formatDate(m.endDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center sm:items-start gap-1 sm:ml-2">
                        <Badge className={`text-xs ${getStatusColor(m.status)}`}>
                          {m.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
                          onClick={() => setMedicationToDelete(m)}
                          title="Delete medication"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-t border-gray-200 dark:border-gray-800 pt-2 mt-2"
                      onClick={() => handleViewMedication(m)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">No past medications</div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="tests" className="space-y-3">
          {testResults.map((t) => (
            <div key={t.test} className="bg-gray-50 dark:bg-gray-900/20 rounded-md p-3 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.test}</div>
                <Badge variant={t.status === "High" ? "destructive" : "secondary"} className={t.status === "High" ? "bg-red-100 text-red-800" : ""}>
                  {t.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-1">{t.result}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />{t.date}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Medication Details Modal */}
      <Dialog open={!!selectedMedication} onOpenChange={() => setSelectedMedication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Medication Details</DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Medication Name</div>
                  <div className="font-medium text-lg">{selectedMedication.medicationName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Generic Name</div>
                  <div className="font-medium">{selectedMedication.genericName}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Drug Code</div>
                  <div className="font-medium">{selectedMedication.drugCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Dosage</div>
                  <div className="font-medium">{selectedMedication.dosage}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Route</div>
                  <div className="font-medium capitalize">{selectedMedication.route}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Frequency</div>
                  <div className="font-medium">{selectedMedication.frequency}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Indication</div>
                  <div className="font-medium">{selectedMedication.indication}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge className={getStatusColor(selectedMedication.status)}>
                    {selectedMedication.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                  <div className="font-medium">{formatDate(selectedMedication.startDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">End Date</div>
                  <div className="font-medium">{formatDate(selectedMedication.endDate)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Prescribed By</div>
                  <div className="font-medium">{selectedMedication.prescribedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Verified By Pharmacist</div>
                  <Badge variant={selectedMedication.verifiedByPharmacist ? "default" : "secondary"}>
                    {selectedMedication.verifiedByPharmacist ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              {selectedMedication.notes && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <div className="text-sm bg-gray-50 dark:bg-gray-900/20 rounded-md p-3 border border-gray-200 dark:border-gray-800">
                    {selectedMedication.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!medicationToDelete} onOpenChange={() => setMedicationToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the medication <strong>{medicationToDelete?.medicationName}</strong>? This action cannot be undone and all medication data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMedicationToDelete(null)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteMedication} 
              className="bg-red-600 hover:bg-red-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Medication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

