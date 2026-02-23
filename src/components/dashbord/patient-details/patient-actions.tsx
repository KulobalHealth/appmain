import { Button } from "@/components/ui/button"
import { Plus, Activity, Pill } from "lucide-react"

interface PatientActionsProps {
  onAddAllergy: () => void
  onAddMedicalCondition: () => void
  onAddMedication: () => void
}

export function PatientActions({ onAddAllergy, onAddMedicalCondition, onAddMedication }: PatientActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-5">
      <Button 
        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs sm:text-sm w-full sm:w-auto"
        onClick={onAddAllergy}
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Add Allergy
      </Button>
      <Button 
        variant="outline" 
        className="gap-2 text-xs sm:text-sm w-full sm:w-auto"
        onClick={onAddMedicalCondition}
      >
        <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Add Medical </span>Conditions
      </Button>
      <Button 
        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs sm:text-sm w-full sm:w-auto"
        onClick={onAddMedication}
      >
        <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Add Medication
      </Button>
    </div>
  )
}

