import { Skeleton } from "@/components/ui/skeleton"

export default function SignupSkeleton() {
  return (
    <div className="flex flex-row justify-between h-screen overflow-hidden">
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full bg-white p-4">
        {/* Header skeleton */}
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-72 mb-6" />

        {/* Form skeleton */}
        <div className="w-full max-w-sm space-y-4">
          {/* Step indicator skeleton */}
          <Skeleton className="h-4 w-32 mb-4" />

          {/* Business name input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Owner name input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Location input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Email input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Telephone input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Password input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Role selection skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="flex gap-4 py-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>

          {/* Sign in link skeleton */}
          <div className="text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>

          {/* Copyright skeleton */}
          <Skeleton className="h-3 w-64 mx-auto mt-6" />
        </div>
      </div>

      {/* Image skeleton */}
      <div className="hidden lg:flex lg:w-1/2 h-full">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  )
} 