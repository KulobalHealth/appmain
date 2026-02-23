"use client"
import { Button } from "@/components/ui/button"
import TextInput from "@/components/ui/text-input"
import Loader from "@/components/loader"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"


const formSchema = z.object({
  pharmacy: z.string().min(1, "Pharmacy name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof formSchema>

export default function BusinessRegistrationForm() {
  const { register, isLoading, error, clearError } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pharmacy: "",
      firstName: "",
      lastName: "",
      location: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  })

  const handleNext = async () => {
    const isValid = await trigger(["pharmacy", "firstName", "lastName", "location"])
    if (isValid) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data)
    clearError()
    
    const loadingToast = toast.loading("Creating your account...", { icon: "⏳" })
    
    try {
      const result = await register({
        pharmacy: data.pharmacy,
        firstName: data.firstName,
        lastName: data.lastName,
        location: data.location,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      })
      
      toast.dismiss(loadingToast)
      
      if (result.success) {
        reset()
        toast.success("Account created successfully! Please verify your email.", {
          icon: "🎉",
          duration: 3000,
        })
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)
      } else {
        toast.error(result.error || "Registration failed. Please try again.", {
          icon: "❌",
          duration: 4000,
        })
      }
    } catch (err: any) {
      toast.dismiss(loadingToast)
      toast.error("Unexpected error occurred. Please try again.", { 
        icon: "❌", 
        duration: 4000 
      })
    }
  }

  if (currentStep === 1) {
    return (
      <>
        {/* Progress Bar */}
        <div className="w-full max-w-sm mt-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white">1</span>
            <div className="flex-1 h-1 rounded bg-emerald-200 dark:bg-emerald-800">
              <div className="h-1 rounded bg-emerald-600" style={{ width: "50%" }} />
            </div>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">2</span>
          </div>
        </div>

        <div className="w-full max-w-sm mt-6 space-y-4">
          <div className="space-y-1">
            <Controller
              name="pharmacy"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Enter pharmacy name"
                  label="Pharmacy Name"
                  helperText="Registered name as it appears on documents"
                  {...field}
                  error={errors.pharmacy?.message}
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Enter first name"
                  label="First Name"
                  helperText="Owner or contact person's first name"
                  {...field}
                  error={errors.firstName?.message}
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Enter last name"
                  label="Last Name"
                  helperText="Owner or contact person's last name"
                  {...field}
                  error={errors.lastName?.message}
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Enter location"
                  label="Location"
                  helperText="City or area of operation"
                  {...field}
                  error={errors.location?.message}
                />
              )}
            />
          </div>

          <Button className="w-full" variant="default" type="button" onClick={handleNext}>
            Continue
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      {error && (
        <div className="w-full max-w-sm bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      {/* Progress Bar */}
      <div className="w-full max-w-sm mt-4">
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">1</span>
          <div className="flex-1 h-1 rounded bg-emerald-200 dark:bg-emerald-800">
            <div className="h-1 rounded bg-emerald-600" style={{ width: "100%" }} />
          </div>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white">2</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Form validation errors:", errors)
        toast.error("Please fix the errors before submitting.", { icon: "❌" })
      })} className="w-full max-w-sm mt-6 space-y-4">

        <div className="space-y-1">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Enter business email"
                label="Business Email Address"
                autoComplete="email"
                helperText="We'll send verification to this address"
                {...field}
                error={errors.email?.message}
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Enter phone number"
                label="Phone Number"
                autoComplete="tel"
                helperText="Active number for order and support updates"
                {...field}
                error={errors.phoneNumber?.message}
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Enter password"
                label="Password"
                type="password"
                showPasswordToggle
                autoComplete="new-password"
                helperText="At least 6 characters"
                {...field}
                error={errors.password?.message}
              />
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
            Back
          </Button>
          <Button className="flex-1" variant="default" type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : "Register Business"}
          </Button>
        </div>
      </form>
    </>
  )
} 