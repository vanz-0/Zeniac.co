import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { reference } = await req.json();
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!reference) {
            return NextResponse.json({ success: false, message: "No reference provided" }, { status: 400 });
        }

        if (!secretKey) {
            console.error("PAYSTACK_SECRET_KEY is missing");
            return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
        }

        // 1. Verify with Paystack
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        const verifyData = await verifyRes.json();

        if (verifyData.status && verifyData.data.status === "success") {
            const paymentInfo = verifyData.data;
            const userEmail = paymentInfo.customer.email;
            const amount = paymentInfo.amount / 100; // Convert to KES
            const currency = paymentInfo.currency;

            if (!supabaseAdmin) {
                console.error("Supabase Admin client missing");
                return NextResponse.json({ success: true, message: "Paystack verified but Supabase update failed" });
            }

            // 2. Log payment in database
            const { error: paymentError } = await supabaseAdmin
                .from("payments")
                .insert({
                    user_email: userEmail,
                    amount: amount,
                    currency: currency,
                    reference: reference,
                    status: "success",
                    metadata: paymentInfo
                });

            if (paymentError) {
                console.error("Error logging payment:", paymentError);
            }

            // 3. Mark user profile as having paid for vault
            const { error: profileError } = await supabaseAdmin
                .from("user_profiles")
                .update({ paid_vault: true })
                .eq("user_email", userEmail);

            if (profileError) {
                console.error("Error updating user profile:", profileError);
                // Create profile if missing? Actually ensureUserProfile should have handled it, 
                // but let's be safe later if needed.
            }

            return NextResponse.json({
                success: true,
                message: "Transaction verified and recorded",
                data: verifyData.data
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Verification failed or transaction not successful",
                data: verifyData
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Paystack verification error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
