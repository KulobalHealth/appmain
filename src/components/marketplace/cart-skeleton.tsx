import { Skeleton } from "@/components/ui/skeleton"

export default function CartSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen mt-24 dark:bg-background dark:text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="space-y-4">
            {/* Cart Item 1 */}
            <div className="bg-white dark:bg-card shadow-sm rounded-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row min-h-[200px] sm:h-[200px]">
                {/* Image */}
                <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-gray-50 dark:bg-muted flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>

                {/* Details */}
                <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col justify-between flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  {/* Quantity & Price */}
                  <div className="w-full sm:w-[40%] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-10">
                    <Skeleton className="h-6 w-16" />
                    <div className="flex items-center bg-gray-200 dark:bg-muted rounded-full border p-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-6 w-8 mx-4" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Item 2 */}
            <div className="bg-white dark:bg-card shadow-sm rounded-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row min-h-[200px] sm:h-[200px]">
                {/* Image */}
                <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-gray-50 dark:bg-muted flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>

                {/* Details */}
                <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col justify-between flex-1">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-28" />
                  </div>

                  {/* Quantity & Price */}
                  <div className="w-full sm:w-[40%] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-10">
                    <Skeleton className="h-6 w-16" />
                    <div className="flex items-center bg-gray-200 dark:bg-muted rounded-full border p-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-6 w-8 mx-4" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6">
            <div className="border-b pb-4 mb-4">
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-8" />
              </div>

              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}