"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;

        setStatus("loading");

        try {
            const response = await fetch("/api/forms/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    serviceId: "newsletter-signup"
                }),
            });

            if (response.ok) {
                setStatus("success");
                setEmail("");
                setName("");
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col gap-4 p-4 bg-zeniac-gold/10 border border-zeniac-gold/20 rounded">
                <div className="flex items-center gap-2 text-zeniac-gold font-mono text-sm">
                    <Check className="w-4 h-4" />
                    <span>Intelligence Secured.</span>
                </div>
                <p className="text-xs text-white/70 font-mono leading-relaxed">
                    Discovery protocol initiated. Secure your slot on the calendar immediately to deep-scan your operations.
                </p>
                <a
                    href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ087pY4N8y6R2t0l6R7tN7pY4N8y6R2t0l6R7t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zeniac-gold text-black px-4 py-2 rounded font-mono text-xs font-bold uppercase text-center hover:bg-white transition-colors"
                >
                    SECURE CALL TIME
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex flex-col gap-3">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    Join the Intelligence Network
                </label>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        required
                        className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zeniac-gold transition-colors"
                    />
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            required
                            className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zeniac-gold transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="bg-zeniac-gold text-black px-4 py-2 rounded font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center min-w-[40px]"
                        >
                            {status === "loading" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ArrowRight className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
                {status === "error" && (
                    <p className="text-xs text-red-500 font-mono">
                        Transmission failed. Try again.
                    </p>
                )}
            </div>
        </form>
    );
}
