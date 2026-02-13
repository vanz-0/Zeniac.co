"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Phone,
    Mail,
    Calendar,
    ArrowRight,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData?: {
        name?: string;
        email?: string;
        website?: string;
    };
}

export function BookingModal({ isOpen, onClose, userData }: BookingModalProps) {
    const phoneNumber = "+254724898620";
    const email = "merchzenith@gmail.com";

    // Brand voice email template
    const subject = userData?.name
        ? `Strategy Session Request | ${userData.name} | Zeniac`
        : "Strategy Session Request | Zeniac";

    const body = `Hi Zeniac Team,

I'm reaching out to request a strategic discovery session.

${userData?.name ? `Name: ${userData.name}` : ""}
${userData?.email ? `Email: ${userData.email}` : ""}
${userData?.website ? `Website: ${userData.website}` : ""}

I'd like to discuss:
[ ] Scaling my current social presence
[ ] Automating lead generation
[ ] Building a high-conversion digital asset
[ ] Full-scale digital dominance

Preferred contact channel:
[ ] WhatsApp Call
[ ] Google Meet
[ ] Phone Call (Kenya Only)

Looking forward to the transformation.`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const whatsappMessage = userData?.name
        ? `Hi Zeniac, I'm ${userData.name}. I'd like to discuss scaling my business ${userData.website ? `(${userData.website})` : ""}.`
        : "Hi Zeniac, I'd like to book a discovery call to discuss scaling my business.";

    const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`;

    const contactOptions = [
        {
            title: "WhatsApp Message",
            description: "Instant response for quick inquiries",
            icon: MessageSquare,
            href: whatsappLink,
            color: "text-green-500",
            bg: "hover:bg-green-500/10",
        },
        {
            title: "Direct Phone Call",
            description: "Speak with a strategist immediately",
            icon: Phone,
            href: `tel:${phoneNumber}`,
            color: "text-blue-500",
            bg: "hover:bg-blue-500/10",
        },
        {
            title: "Email Consultation",
            description: "Formal request with brand-voice template",
            icon: Mail,
            href: mailtoLink,
            color: "text-zeniac-gold",
            bg: "hover:bg-zeniac-gold/10",
        },
        {
            title: "Google Meet",
            description: "Request a video link via WhatsApp/Email",
            icon: Calendar,
            href: whatsappLink, // Redirecting to WhatsApp to request a link
            color: "text-purple-500",
            bg: "hover:bg-purple-500/10",
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-zeniac-black border-white/10 p-0 overflow-hidden outline-none">
                <div className="relative h-32 bg-zeniac-gold flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="relative z-10 text-center">
                        <DialogTitle className="text-2xl font-typewriter font-black text-zeniac-black uppercase tracking-tighter">
                            Initiate Protocol
                        </DialogTitle>
                        <DialogDescription className="text-zeniac-black/70 font-mono text-xs font-bold uppercase mt-1">
                            Choose your communication channel
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-6 grid gap-3">
                    {contactOptions.map((option) => (
                        <a
                            key={option.title}
                            href={option.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "group flex items-center gap-4 p-4 border border-white/5 rounded-xl transition-all duration-300",
                                option.bg,
                                "hover:border-white/20"
                            )}
                        >
                            <div className={cn("p-2.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors", option.color)}>
                                <option.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-mono font-bold text-zeniac-white">
                                    {option.title}
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-mono">
                                    {option.description}
                                </p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </div>

                <div className="px-6 pb-6 pt-2">
                    <Button
                        onClick={onClose}
                        variant="link"
                        className="w-full text-xs font-mono text-muted-foreground hover:text-zeniac-gold transition-colors"
                    >
                        Back to Systems Analysis
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
