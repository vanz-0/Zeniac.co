"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

export const Select = ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (val: string) => void }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const ctx = React.useContext(SelectContext);
    if (!ctx) return null;
    return (
        <button
            type="button"
            onClick={() => ctx.setOpen(!ctx.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
};

export const SelectValue = ({ placeholder }: { placeholder: string }) => {
    const ctx = React.useContext(SelectContext);
    if (!ctx) return null;
    // We can't easily show the selected label without mapping, so for MVP we just show the value or placeholder
    // In a real app we'd map value -> label.
    // Hack: we'll just rely on the parent updating this or just show value if basic.
    // Better hack: The user of this component (ToolkitSurvey) should probably handle the display if we don't have full Radix power.
    // BUT, for ToolkitSurvey, the options are simple text.
    return <span className="block truncate">{ctx.value || placeholder}</span>;
};

export const SelectContent = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const ctx = React.useContext(SelectContext);
    if (!ctx || !ctx.open) return null;
    return (
        <div className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 w-full mt-1",
            className
        )}>
            <div className="p-1">{children}</div>
        </div>
    );
};

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
    const ctx = React.useContext(SelectContext);
    if (!ctx) return null;
    const isSelected = ctx.value === value;
    return (
        <div
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                isSelected && "bg-accent/50"
            )}
            onClick={() => {
                ctx.onValueChange(value);
                ctx.setOpen(false);
            }}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            <span className="truncate">{children}</span>
        </div>
    );
};
