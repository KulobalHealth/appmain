import { Badge } from "@/components/ui/badge"

interface PatientInfoCardProps {
  patientId: string
  formattedDob: string
  patientType: string
  location: string
}

export function PatientInfoCard({ patientId, formattedDob, patientType, location }: PatientInfoCardProps) {
  return (
    <div className="rounded-lg border border-green-100 dark:border-green-900/40 p-3 sm:p-4 md:p-5 bg-white dark:bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-sm sm:text-base font-semibold">Patient Information</div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 text-xs">
            ID #{patientId}
          </Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 text-xs">
            DOB {formattedDob}
          </Badge>
        </div>
      </div>

      {/* Demographics strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-0 sm:mb-5">
        <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Patient Type</div>
          <div className="text-sm font-medium capitalize">{patientType}</div>
        </div>
        <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Date of Birth</div>
          <div className="text-sm font-medium">{formattedDob}</div>
        </div>
        <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Location</div>
          <div className="text-sm font-medium">{location}</div>
        </div>
      </div>
    </div>
  )
}

