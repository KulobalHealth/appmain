import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Activity, Pill } from "lucide-react"
import type { Patient } from "@/store/patient-store"

interface PatientHeaderProps {
  patient: Patient
  initials: string
  fullName: string
  patientType: string
  onBack: () => void
  onAddAllergy?: () => void
  onAddMedicalCondition?: () => void
  onAddMedication?: () => void
}

export function PatientHeader({ 
  patient, 
  initials, 
  fullName, 
  patientType, 
  onBack,
  onAddAllergy,
  onAddMedicalCondition,
  onAddMedication
}: PatientHeaderProps) {
  return (
    <div className="flex flex-col gap-3 px-4 sm:px-6 py-4 border-b border-green-100 dark:border-green-900/50">
      {/* Top row: Patient info and back button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-green-200 dark:border-green-700">
            <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
              {fullName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {patientType === "chronic" ? "Chronic Patient" : "Normal Patient"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 capitalize text-xs">
            {patientType}
          </Badge>
          <Button variant="outline" size="sm" onClick={onBack} className="flex-1 sm:flex-initial text-xs sm:text-sm">
            Back to table
          </Button>
        </div>
      </div>
      
      {/* Quick Actions row */}
      {(onAddAllergy || onAddMedicalCondition || onAddMedication) && (
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-green-50 dark:border-green-900/30">
          {onAddAllergy && (
            <Button 
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8"
              onClick={onAddAllergy}
            >
              <Plus className="w-3.5 h-3.5" />Add Allergy
            </Button>
          )}
          {onAddMedicalCondition && (
            <Button 
              size="sm"
              variant="outline" 
              className="gap-1.5 text-xs h-8"
              onClick={onAddMedicalCondition}
            >
              <Activity className="w-3.5 h-3.5" />Add Condition
            </Button>
          )}
          {onAddMedication && (
            <Button 
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8"
              onClick={onAddMedication}
            >
              <Pill className="w-3.5 h-3.5" />Add Medication
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

