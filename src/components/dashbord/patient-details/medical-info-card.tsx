import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Activity, Trash2, Eye } from "lucide-react"
import { useAllergyStore, type Allergy } from "@/store/allergy-store"
import { useConditionStore, type Condition } from "@/store/condition-store"
import toast from "react-hot-toast"
import { format } from "date-fns"

interface MedicalInfoCardProps {
  patientUuid?: string
}

// Helper function to get severity color
const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

// Helper function to get severity color for conditions
const getConditionSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "mild":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "moderate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "severe":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    case "resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
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
    return format(date, "dd MMM, yyyy")
  } catch {
    return dateString
  }
}

export function MedicalInfoCard({ patientUuid }: MedicalInfoCardProps) {
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null)
  const [allergyToDelete, setAllergyToDelete] = useState<Allergy | null>(null)
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null)
  const [conditionToDelete, setConditionToDelete] = useState<Condition | null>(null)
  const { allergies, fetchPatientAllergies, isLoading: isAllergyLoading, deleteAllergy } = useAllergyStore()
  const { conditions, fetchPatientConditions, isLoading: isConditionLoading, deleteCondition } = useConditionStore()

  useEffect(() => {
    if (patientUuid) {
      console.log("[MedicalInfoCard] Fetching allergies for patient:", patientUuid)
      fetchPatientAllergies(patientUuid)
      console.log("[MedicalInfoCard] Fetching conditions for patient:", patientUuid)
      fetchPatientConditions(patientUuid)
    }
  }, [patientUuid, fetchPatientAllergies, fetchPatientConditions])

  const handleDeleteAllergy = async () => {
    if (!allergyToDelete?.id || !patientUuid) {
      toast.error("Unable to delete allergy")
      return
    }

    const result = await deleteAllergy(allergyToDelete.id, patientUuid)
    
    if (result.success) {
      toast.success("Allergy deleted successfully")
      setAllergyToDelete(null)
    } else {
      toast.error(result.error || "Failed to delete allergy")
    }
  }

  const handleDeleteCondition = async () => {
    if (!conditionToDelete?.id || !patientUuid) {
      toast.error("Unable to delete condition")
      return
    }

    const result = await deleteCondition(conditionToDelete.id, patientUuid)
    
    if (result.success) {
      toast.success("Medical condition deleted successfully")
      setConditionToDelete(null)
    } else {
      toast.error(result.error || "Failed to delete condition")
    }
  }
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
      <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3 sm:mb-4">Medical Information</div>
      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="inline-flex h-9 sm:h-10 items-center justify-start rounded-none border-b border-gray-200 dark:border-gray-800 bg-transparent p-0 w-full mb-3 sm:mb-4 overflow-x-auto">
          <TabsTrigger 
            value="conditions" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 data-[state=active]:font-semibold"
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Medical </span>Conditions
          </TabsTrigger>
          <TabsTrigger 
            value="allergies" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 data-[state=active]:font-semibold"
          >
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Allergies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="mt-0">
          {isConditionLoading ? (
            <div className="text-sm text-muted-foreground py-2">Loading conditions...</div>
          ) : conditions.length > 0 ? (
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition.id || condition.diseaseName} className="bg-gray-50 dark:bg-gray-900/20 rounded-md p-2.5 sm:p-3 border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="font-medium text-xs sm:text-sm">{condition.diseaseName}</div>
                        <Badge variant="outline" className="text-xs">{condition.diseaseCode}</Badge>
                        <Badge className={`text-xs ${getConditionSeverityColor(condition.severity)}`}>
                          {condition.severity}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(condition.status)}`}>
                          {condition.status}
                        </Badge>
                        {condition.chronic && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                            Chronic
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">{condition.category}</div>
                      {condition.notes && (
                        <div className="text-xs text-muted-foreground mb-1 line-clamp-2">{condition.notes}</div>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-muted-foreground">
                        <span>Diagnosed: {formatDate(condition.diagnosedDate)}</span>
                        <span>•</span>
                        <span>By: {condition.diagnosedBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 flex-shrink-0"
                        onClick={() => setSelectedCondition(condition)}
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
                        onClick={() => setConditionToDelete(condition)}
                        title="Delete condition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-2">No medical conditions recorded</div>
          )}
        </TabsContent>

        <TabsContent value="allergies" className="mt-0">
          {isAllergyLoading ? (
            <div className="text-sm text-muted-foreground py-2">Loading allergies...</div>
          ) : allergies.length > 0 ? (
            <div className="space-y-2">
              {allergies.map((allergy) => (
                <div key={allergy.id || allergy.allergyName} className="bg-gray-50 dark:bg-gray-900/20 rounded-md p-2.5 sm:p-3 border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="font-medium text-xs sm:text-sm">{allergy.allergyName}</div>
                        <Badge className={`text-xs ${getSeverityColor(allergy.allergySeverity)}`}>
                          {allergy.allergySeverity}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(allergy.status)}`}>
                          {allergy.status}
                        </Badge>
                        {allergy.medicallyVerified && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1 line-clamp-2">{allergy.allergyDescription}</div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-muted-foreground">
                        <span className="capitalize">{allergy.allergyType}</span>
                        <span>•</span>
                        <span className="capitalize">{allergy.allergyReaction}</span>
                        <span>•</span>
                        <span>Onset: {formatDate(allergy.onsetDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 flex-shrink-0"
                        onClick={() => setSelectedAllergy(allergy)}
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
                        onClick={() => setAllergyToDelete(allergy)}
                        title="Delete allergy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-2">No allergies recorded</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Allergy Details Modal */}
      <Dialog open={!!selectedAllergy} onOpenChange={() => setSelectedAllergy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Allergy Details</DialogTitle>
          </DialogHeader>
          {selectedAllergy && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Allergy Name</div>
                  <div className="font-medium text-lg">{selectedAllergy.allergyName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Type</div>
                  <div className="font-medium capitalize">{selectedAllergy.allergyType}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div className="text-sm bg-gray-50 dark:bg-gray-900/20 rounded-md p-3 border border-gray-200 dark:border-gray-800">
                  {selectedAllergy.allergyDescription}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Severity</div>
                  <Badge className={getSeverityColor(selectedAllergy.allergySeverity)}>
                    {selectedAllergy.allergySeverity}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge className={getStatusColor(selectedAllergy.status)}>
                    {selectedAllergy.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Reaction</div>
                  <div className="font-medium capitalize">{selectedAllergy.allergyReaction}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Reported By</div>
                  <div className="font-medium capitalize">{selectedAllergy.reportedBy}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Onset Date</div>
                  <div className="font-medium">{formatDate(selectedAllergy.onsetDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Medically Verified</div>
                  <Badge variant={selectedAllergy.medicallyVerified ? "default" : "secondary"}>
                    {selectedAllergy.medicallyVerified ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!allergyToDelete} onOpenChange={() => setAllergyToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the allergy <strong>{allergyToDelete?.allergyName}</strong>? This action cannot be undone and all allergy data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllergyToDelete(null)} disabled={isAllergyLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteAllergy} 
              className="bg-red-600 hover:bg-red-700 text-white" 
              disabled={isAllergyLoading}
            >
              {isAllergyLoading ? "Deleting..." : "Delete Allergy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Condition Details Modal */}
      <Dialog open={!!selectedCondition} onOpenChange={() => setSelectedCondition(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Medical Condition Details</DialogTitle>
          </DialogHeader>
          {selectedCondition && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Disease Name</div>
                  <div className="font-medium text-lg">{selectedCondition.diseaseName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Disease Code (ICD-10)</div>
                  <div className="font-medium">{selectedCondition.diseaseCode}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <div className="font-medium">{selectedCondition.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Severity</div>
                  <Badge className={getConditionSeverityColor(selectedCondition.severity)}>
                    {selectedCondition.severity}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge className={getStatusColor(selectedCondition.status)}>
                    {selectedCondition.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Chronic</div>
                  <Badge variant={selectedCondition.chronic ? "default" : "secondary"}>
                    {selectedCondition.chronic ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Diagnosed Date</div>
                  <div className="font-medium">{formatDate(selectedCondition.diagnosedDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Diagnosed By</div>
                  <div className="font-medium">{selectedCondition.diagnosedBy}</div>
                </div>
              </div>
              {selectedCondition.notes && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <div className="text-sm bg-gray-50 dark:bg-gray-900/20 rounded-md p-3 border border-gray-200 dark:border-gray-800">
                    {selectedCondition.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Condition Confirmation Modal */}
      <Dialog open={!!conditionToDelete} onOpenChange={() => setConditionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the medical condition <strong>{conditionToDelete?.diseaseName}</strong>? This action cannot be undone and all condition data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConditionToDelete(null)} disabled={isConditionLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteCondition} 
              className="bg-red-600 hover:bg-red-700 text-white" 
              disabled={isConditionLoading}
            >
              {isConditionLoading ? "Deleting..." : "Delete Condition"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

