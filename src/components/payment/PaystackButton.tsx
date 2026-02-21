"use client";

import React from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";

interface PaystackProps {
    amount: number; // In KES
    email: string;
    onSuccess: (reference: string) => void;
    onClose: () => void;
    className?: string;
    children?: React.ReactNode;
}

export default function PaystackTrigger({
    amount,
    email,
    onSuccess,
    onClose,
    className,
    children,
}: PaystackProps) {
    const config = {
        reference: new Date().getTime().toString(),
        email: email,
        amount: amount * 100, // Paystack expects amount in Kobo/Cents
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: "KES",
    };

    const initializePayment = usePaystackPayment(config);

    const handlePaystackSuccessAction = (reference: any) => {
        onSuccess(reference.reference);
    };

    const handlePaystackCloseAction = () => {
        onClose();
    };

    return (
        <Button
            className={className}
            onClick={() => {
                if (!config.publicKey) {
                    alert("Paystack Public Key is missing. Please check your environment variables.");
                    return;
                }
                initializePayment({
                    onSuccess: handlePaystackSuccessAction,
                    onClose: handlePaystackCloseAction,
                });
            }}
        >
            {children || "Pay Now"}
        </Button>
    );
}
