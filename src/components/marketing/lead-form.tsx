"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadFormProps {
    serviceId: string;
    resourceName: string;
    onSuccess?: () => void;
}

export function LeadForm({ serviceId, resourceName, onSuccess }: LeadFormProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/forms/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, serviceId }),
            });

            if (response.ok) {
                setStatus("success");
                onSuccess?.();
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 space-y-4"
            >
                <CheckCircle className="w-12 h-12 text-zeniac-gold mx-auto" />
                <h3 className="text-xl font-typewriter font-black text-white uppercase">Payload Sent</h3>
                <p className="text-sm font-mono text-muted-foreground">
                    Check your inbox. The <strong>{resourceName}</strong> is on its way.
                </p>
                <Button
                    variant="outline"
                    className="mt-4 border-zeniac-gold text-zeniac-gold hover:bg-zeniac-gold hover:text-black font-mono uppercase"
                    onClick={() => {
                        setStatus("idle");
                        setName("");
                        setEmail("");
                    }}
                >
                    Send Another link
                </Button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-zeniac-gold">Intelligence Recipient Name</Label>
                <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-black/50 border-white/10 rounded-none font-mono focus:border-zeniac-gold transition-colors"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-zeniac-gold">Transmission Endpoint (Email)</Label>
                <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/50 border-white/10 rounded-none font-mono focus:border-zeniac-gold transition-colors"
                />
            </div>

            <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-typewriter font-black uppercase rounded-none tracking-tighter"
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Transmitting...
                    </>
                ) : (
                    <>
                        Claim {resourceName} <Send className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>

            {status === "error" && (
                <p className="text-xs font-mono text-destructive text-center">
                    Transmission failed. Please retry connection.
                </p>
            )}
        </form>
    );
}
