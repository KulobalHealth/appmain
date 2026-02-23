import { Phone, Mail, MapPin } from "lucide-react"

interface ContactInfoCardProps {
  telephone: string
  email: string
  location: string
}

export function ContactInfoCard({ telephone, email, location }: ContactInfoCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 sm:p-4 mb-4 sm:mb-5">
      <div className="text-sm text-gray-800 dark:text-gray-100 font-semibold mb-3">Contact Information</div>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"><Phone className="w-4 h-4 flex-shrink-0" />Phone</div>
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base break-all sm:break-normal">{telephone}</div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"><Mail className="w-4 h-4 flex-shrink-0" />Email</div>
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base break-all sm:break-normal">{email}</div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"><MapPin className="w-4 h-4 flex-shrink-0" />Location</div>
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base text-left sm:text-right break-words">{location}</div>
        </div>
      </div>
    </div>
  )
}

