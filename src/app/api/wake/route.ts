import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Optional: Fire and forget a call to Modal to warm it up
    // fetch("https://merchzenith--analyze.modal.run", { method: "POST", body: JSON.stringify({ warm: true }) }).catch(() => {});

    return NextResponse.json({ status: 'ready', timestamp: Date.now() });
}
