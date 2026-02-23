"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, User, TestTube, Clock, FileText } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface RapidTestFormData {
  patientName: string
  testType: string
  conductedBy: string
  priority: string
  notes: string
  scheduledDate: Date | undefined
}

interface AddRapidTestDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: RapidTestFormData) => void
}

export default function AddRapidTestDialog({ isOpen, onClose, onSubmit }: AddRapidTestDialogProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    testType: "",
    conductedBy: "",
    priority: "",
    notes: "",
    scheduledDate: undefined as Date | undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    onClose()
    // Reset form
    setFormData({
      patientName: "",
      testType: "",
      conductedBy: "",
      priority: "",
      notes: "",
      scheduledDate: undefined,
    })
  }

  const handleCancel = () => {
    onClose()
    // Reset form
    setFormData({
      patientName: "",
      testType: "",
      conductedBy: "",
      priority: "",
      notes: "",
      scheduledDate: undefined,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-background border-green-200 dark:border-green-800">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-green-900 dark:text-green-100 flex items-center">
            <TestTube className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
            Schedule New Rapid Test
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information Section */}
          <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Patient Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-gray-700 dark:text-gray-300 font-medium">
                  Patient Name *
                </Label>
                <Select
                  value={formData.patientName}
                  onValueChange={(value) => setFormData({ ...formData, patientName: value })}
                >
                  <SelectTrigger className="border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                    <SelectItem value="sarah-davis">Sarah Davis</SelectItem>
                    <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conductedBy" className="text-gray-700 dark:text-gray-300 font-medium">
                  Conducted By *
                </Label>
                <Select
                  value={formData.conductedBy}
                  onValueChange={(value) => setFormData({ ...formData, conductedBy: value })}
                >
                  <SelectTrigger className="border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select doctor/technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                    <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                    <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                    <SelectItem value="dr-wilson">Dr. Wilson</SelectItem>
                    <SelectItem value="dr-davis">Dr. Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Test Details Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <TestTube className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Test Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testType" className="text-gray-700 dark:text-gray-300 font-medium">
                  Test Type *
                </Label>
                <Select
                  value={formData.testType}
                  onValueChange={(value) => setFormData({ ...formData, testType: value })}
                >
                  <SelectTrigger className="border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                    <SelectItem value="blood-glucose">Blood Glucose</SelectItem>
                    <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
                    <SelectItem value="cholesterol">Cholesterol</SelectItem>
                    <SelectItem value="hemoglobin">Hemoglobin</SelectItem>
                    <SelectItem value="urine-test">Urine Test</SelectItem>
                    <SelectItem value="ecg">ECG</SelectItem>
                    <SelectItem value="thyroid-function">Thyroid Function</SelectItem>
                    <SelectItem value="covid-19">COVID-19 Rapid Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300 font-medium">
                  Priority Level
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                    <SelectItem value="routine">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Routine
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Scheduling Section */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Scheduling</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledDate" className="text-gray-700 dark:text-gray-300 font-medium">
                Scheduled Date & Time
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50",
                      !formData.scheduledDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700">
                  <Calendar
                    mode="single"
                    selected={formData.scheduledDate}
                    onSelect={(date) => setFormData({ ...formData, scheduledDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Additional Information</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300 font-medium">
                Notes & Instructions
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any special instructions, patient preparation requirements, or additional notes..."
                className="min-h-[100px] border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
            >
              Schedule Rapid Test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
