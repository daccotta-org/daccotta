import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import React from "react"

export function FriendCard({
    title,
    children,
    className,
    onTitleClick,
    action,
}: {
    title: string
    children: React.ReactNode
    className?: string
    onTitleClick?: () => void
    action?: React.ReactNode
}) {
    return (
        <section
            className={cn(
                "flex flex-col rounded-[4px] border border-border bg-card p-5 md:p-6",
                className
            )}
        >
            <div className="mb-4 flex items-center justify-between gap-2">
                {onTitleClick ? (
                    <button
                        type="button"
                        onClick={onTitleClick}
                        className="group flex items-center gap-1.5 text-left"
                    >
                        <h3 className="text-base font-semibold text-foreground md:text-lg">
                            {title}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-electric" />
                    </button>
                ) : (
                    <h3 className="text-base font-semibold text-foreground md:text-lg">
                        {title}
                    </h3>
                )}
                {action}
            </div>
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </section>
    )
}
