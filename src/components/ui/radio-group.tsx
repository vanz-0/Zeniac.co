"use client";

import * as React from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioGroupContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
} | null>(null);

export const RadioGroup = ({ children, value, onValueChange, className }: { children: React.ReactNode; value: string; onValueChange: (val: string) => void; className?: string }) => {
    return (
        <RadioGroupContext.Provider value={{ value, onValueChange }}>
            <div className={cn("grid gap-2", className)}>{children}</div>
        </RadioGroupContext.Provider>
    );
};

export const RadioGroupItem = ({ value, id, className }: { value: string; id?: string; className?: string }) => {
    const ctx = React.useContext(RadioGroupContext);
    if (!ctx) return null;
    const isSelected = ctx.value === value;
    return (
        <button
            type="button"
            id={id}
            onClick={() => ctx.onValueChange(value)}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
                className,
                isSelected && "bg-primary text-primary-foreground"
            )}
        >
            {isSelected && <Circle className="h-2.5 w-2.5 fill-current text-current" />}
        </button>
    );
};
