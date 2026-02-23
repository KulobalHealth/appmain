"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, Save, X, AlertCircle, Calendar, User, Pill, Clock, CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function NewPrescription() {
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    frequency: "",
    additionalInfo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Handle form submission
  }

  const handleCancel = () => {
    window.history.back()
  }

  // Sample data for selects
  const patients = [
    { value: "john-doe", label: "John Doe" },
    { value: "jane-smith", label: "Jane Smith" },
    { value: "michael-brown", label: "Michael Brown" },
    { value: "sarah-wilson", label: "Sarah Wilson" },
  ]

  const medications = [
    { value: "paracetamol", label: "Paracetamol" },
    { value: "amoxicillin", label: "Amoxicillin" },
    { value: "ibuprofen", label: "Ibuprofen" },
    { value: "metformin", label: "Metformin" },
    { value: "atorvastatin", label: "Atorvastatin" },
  ]

  const frequencies = [
    { value: "once-daily", label: "Once daily" },
    { value: "twice-daily", label: "Twice daily" },
    { value: "three-times-daily", label: "Three times daily" },
    { value: "four-times-daily", label: "Four times daily" },
    { value: "as-needed", label: "As needed" },
    { value: "before-meals", label: "Before meals" },
    { value: "after-meals", label: "After meals" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-transparent">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-6 group"
            onClick={handleCancel}
          >
            <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Prescriptions</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 dark:bg-green-600 rounded-lg">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">New Prescription</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Create a new prescription for your patient with detailed medication information
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-green-200 dark:border-0 bg-white dark:bg-transparent ">
            <CardHeader className="bg-green-100 dark:bg-transparent border-b border-green-200 dark:border-0">
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                Patient & Medication Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Patient Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
                  >
                    Patient Information
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="patient"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Patient Name <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.patientName}
                      onValueChange={(value) => setFormData({ ...formData, patientName: value })}
                    >
                      <SelectTrigger className="bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400">
                        <SelectValue placeholder="Select patient..." />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.value} value={patient.value}>
                            {patient.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="medication"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                    >
                      <Pill className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Medication <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.medication}
                      onValueChange={(value) => setFormData({ ...formData, medication: value })}
                    >
                      <SelectTrigger className="bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400">
                        <SelectValue placeholder="Select medication..." />
                      </SelectTrigger>
                      <SelectContent>
                        {medications.map((medication) => (
                          <SelectItem key={medication.value} value={medication.value}>
                            {medication.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dosage & Frequency Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700"
                  >
                    Dosage & Frequency
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dosage" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Dosage <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 500mg, 10ml, 2 tablets"
                      className="bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="frequency"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Frequency <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                    >
                      <SelectTrigger className="bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400">
                        <SelectValue placeholder="Select frequency..." />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((frequency) => (
                          <SelectItem key={frequency.value} value={frequency.value}>
                            {frequency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                  >
                    Treatment Schedule
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="startDate"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                          {startDate ? format(startDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="endDate"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                      End Date <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                          {endDate ? format(endDate, "PPP") : "Select end date (optional)"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                  >
                    Additional Information
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Special Instructions & Notes
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Enter any special instructions, warnings, or additional notes for this prescription..."
                    className="min-h-[120px] bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 resize-none"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  />
                </div>
              </div>

              {/* Important Notice */}
              <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Please ensure all prescription details are accurate before saving. This information will be used for
                  patient treatment.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="bg-gray-50 dark:bg-transparent/50 border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-all duration-200 min-w-[160px]"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Prescription
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
