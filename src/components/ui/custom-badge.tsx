import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    type: {
      Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Ongoing: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    },
  },
  defaultVariants: {
    type: "Active",
  },
})

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  type: "Active" | "Completed" | "Ongoing"
  className?: string
}

export function AppBadge({ type, className }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ type }), className)}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current"></span>
      {type}
    </div>
  )
}
