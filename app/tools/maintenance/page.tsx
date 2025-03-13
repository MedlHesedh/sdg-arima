import { Suspense } from "react"
import { MaintenanceScheduler } from "@/components/maintenance-scheduler"
import { Skeleton } from "@/components/ui/skeleton"

export default function MaintenancePage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tool Maintenance</h1>
        <p className="text-muted-foreground mt-1">Schedule and track maintenance for your construction tools</p>
      </div>

      <Suspense fallback={<MaintenanceSchedulerSkeleton />}>
        <MaintenanceScheduler />
      </Suspense>
    </div>
  )
}

function MaintenanceSchedulerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
          </div>
          <div className="p-6 pt-0">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="grid grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-10 w-full mb-6" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
        </div>
      </div>
    </div>
  )
}

