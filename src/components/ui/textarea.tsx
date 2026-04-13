import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-base text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground/50 focus-visible:bg-white/10 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-40 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
