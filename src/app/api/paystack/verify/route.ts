import { NextRequest, NextResponse } from "next/server";

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

        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        const verifyData = await verifyRes.json();

        if (verifyData.status && verifyData.data.status === "success") {
            // Transaction successful
            // TODO: Update user credits in Supabase here
            return NextResponse.json({
                success: true,
                message: "Transaction verified",
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
