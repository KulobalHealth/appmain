"use client"

import type React from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { User } from "lucide-react"
import toast from "react-hot-toast"
import { usePatientStore } from "@/store/patient-store"

export default function AddPatients() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    patientType: "normal" as "chronic" | "normal",
    location: "",
    telephone: "",
    email: "",
  })
  const { addPatient, isLoading } = usePatientStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.location || !formData.telephone) {
      toast.error("Please fill in all required fields")
      return
    }

    // Format date to YYYY-MM-DD
    let formattedDate = formData.dateOfBirth
    if (formData.dateOfBirth.includes("/")) {
      const [day, month, year] = formData.dateOfBirth.split("/")
      formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }

    const result = await addPatient({
      pharmacyId: "", // Will be set in store from auth
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formattedDate,
      patientType: formData.patientType,
      location: formData.location,
      telephone: formData.telephone,
      email: formData.email || null,
    })

    if (result.success) {
      toast.success("Patient registered successfully!", {
        duration: 4000,
        position: "top-center",
      })
      setOpen(false)
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        patientType: "normal",
        location: "",
        telephone: "",
        email: "",
      })
    } else {
      toast.error(result.error || "Failed to register patient", {
        duration: 4000,
        position: "top-center",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6">
          <User className="w-5 h-5" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px] max-h-[90vh] overflow-y-auto p-5 scrollbar-hide">
        <DialogHeader className="px-8 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">Register Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-emerald-600">Patient Registration</h3>
            <p className="text-sm text-muted-foreground">Register a new patient and capture their health information</p>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  className="h-11"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  className="h-11"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  className="h-11"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientType" className="text-sm font-medium">
                  Patient Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.patientType}
                  onValueChange={(value: "chronic" | "normal") => setFormData({ ...formData, patientType: value })}
                >
                  <SelectTrigger id="patientType" className="h-11">
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
                <Label htmlFor="email" className="text-sm font-medium">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className="h-11"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center gap-1 px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm h-11">
                    <span className="text-base">🇬🇭</span>
                    <span>+233</span>
                  </span>
                  <Input
                    id="telephone"
                    placeholder="eg. 201234567"
                    className="rounded-l-none h-11"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="Enter patient location (e.g., Accra, GH)"
                  className="h-11"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
