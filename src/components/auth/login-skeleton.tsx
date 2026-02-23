import { Skeleton } from "@/components/ui/skeleton"

export default function LoginSkeleton() {
  return (
    <div className="flex flex-row justify-between h-screen overflow-hidden dark:bg-background dark:text-white">
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full bg-white dark:bg-background p-4">
        {/* Header skeleton */}
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />

        {/* Form skeleton */}
        <div className="w-full max-w-sm space-y-4">
          {/* Email input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Password input skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Forgot password link skeleton */}
          <div className="text-right">
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>

          {/* Login button skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />

          {/* Sign up link skeleton */}
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