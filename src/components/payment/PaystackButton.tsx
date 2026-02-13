"use client";

import React from "react";
import { Button } from "@/components/ui/button";

// Payment integration placeholder — react-paystack will be installed when payment flow is activated.
// This stub ensures the build passes without the dependency.

interface PaystackProps {
    amount: number;
    email: string;
    planName: string;
    onSuccess?: (reference: any) => void;
    onClose?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export default function PaystackTrigger({
    className,
    children,
}: PaystackProps) {
    return (
        <Button
            className={className}
            onClick={() => {
                alert("Payment integration coming soon. Contact us directly to get started!");
            }}
        >
            {children || "Pay Now"}
        </Button>
    );
}
