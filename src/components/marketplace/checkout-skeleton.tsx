import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CheckoutSkeleton() {
  return (
    <div className="w-full min-h-screen mt-24 bg-gray-50 dark:bg-background">
      {/* Main Content */}
      <main className="flex-1 py-6 px-4 sm:px-6 items-center justify-center">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Shipping & Addresses */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Address Form */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>

              {/* Address Cards */}
              <Card>
                <CardHeader className="border-b">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {/* Address Card 1 */}
                    <div className="flex-shrink-0 w-full sm:w-80 border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>

                    {/* Address Card 2 */}
                    <div className="flex-shrink-0 w-full sm:w-80 border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Method */}
                  <div className="mt-6 pt-6 border-t">
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <div className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-28 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6 pt-6 border-t">
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <div className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-36 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 lg:top-6">
                <CardHeader className="border-b">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-8" />
                    </div>

                    {/* Items List */}
                    <div className="border-t pt-4">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <Skeleton className="h-3 w-28" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>

                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>

                    <div className="pt-4 border-t flex justify-between">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>

                    <Skeleton className="h-12 w-full rounded-md mt-6" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}