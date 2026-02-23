"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  Clock,
  Edit,
  Plus,
  FileText,
  Heart,
  Stethoscope,
} from "lucide-react"
import type { Patient } from "@/lib/patient-data"

interface PatientDetailsModalProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
}

export default function PatientDetailsModal({ patient, isOpen, onClose }: PatientDetailsModalProps) {
  if (!patient) return null

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
      "back pain": "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      "high cholesterol": "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400",
      "thyroid issues": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    }

    const normalizedCondition = condition.toLowerCase()
    return (
      conditionColors[normalizedCondition] || "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-background border-green-200 dark:border-green-800 mx-4">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-green-900 dark:text-green-100">Patient Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between bg-green-50 dark:bg-green-950/30 p-4 md:p-6 rounded-xl border border-green-200 dark:border-green-800 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-green-200 dark:border-green-700 mx-auto sm:mx-0">
                <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xl sm:text-2xl font-bold">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{patient.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:space-x-3">
                  <Badge variant="secondary" className={getGenderColor(patient.gender)}>
                    <User className="h-3 w-3 mr-1" />
                    {patient.gender}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {patient.dob}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start text-sm sm:text-base">
                  <Mail className="h-4 w-4 mr-2" />
                  {patient.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Patient
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-background p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Full Name</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{patient.name}</span>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Date of Birth</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{patient.dob}</span>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Gender</span>
                  <Badge variant="secondary" className={getGenderColor(patient.gender)}>
                    {patient.gender}
                  </Badge>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Patient ID</span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">
                    #{patient.id.toString().padStart(4, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-background p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-4">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Phone Number</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{patient.contact}</span>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Email Address</span>
                  <span className="text-gray-900 dark:text-gray-100">{patient.email}</span>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 dark:text-gray-400">Address</span>
                  <div className="text-right">
                    <div className="flex items-center text-gray-900 dark:text-gray-100">
                      <MapPin className="h-4 w-4 mr-1" />
                      {patient.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white dark:bg-background p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-4">
                <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Medical Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Primary Condition</span>
                  <Badge variant="secondary" className={getConditionColor(patient.condition)}>
                    <Heart className="h-3 w-3 mr-1" />
                    {patient.condition}
                  </Badge>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Last Visit</span>
                  <div className="flex items-center text-gray-900 dark:text-gray-100">
                    <Clock className="h-4 w-4 mr-1" />
                    {patient.lastVisit}
                  </div>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-background p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Last Visit</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{patient.lastVisit} - Routine checkup</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Prescription Updated</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2 days ago - Medication dosage adjusted</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Lab Results</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 week ago - Blood work completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Close
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              View Medical Records
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
