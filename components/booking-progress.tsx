import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingProgressProps {
  currentStep: number
  steps: string[]
}

export function BookingProgress({ currentStep, steps }: BookingProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-20",
                  index <= currentStep ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("flex-1 h-0.5 mx-4 transition-colors", index < currentStep ? "bg-primary" : "bg-muted")}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
