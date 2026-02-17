"use client";
import { Check, ArrowRight, Zap, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "@/components/marketing/lead-form";

const tiers = [
    {
        name: "The 'Taste'",
        id: "taste",
        href: "mailto:merchzenith@gmail.com?subject=Plan Inquiry",
        price: { KES: "FREE", USD: "FREE" },
        description: "For skeptical owners who need to see value first.",
        features: [
            "Digital Dominance Audit (5-Page PDF)",
            "Competitor Gap Analysis",
            "Google Maps Optimization (Fix/Claim pin)",
            "1 Strategy Call (30-min)"
        ],
        cta: "Get Free Access",
        isFree: true,
        popular: false,
        color: "bg-zeniac-white/5",
        border: "border-white/10"
    },
    {
        name: "The 'Hustle'",
        id: "hustle",
        href: "mailto:merchzenith@gmail.com?subject=Plan Inquiry",
        price: { KES: "15K - 25K", USD: "120 - 200" },
        description: "Entry level for Startups & Small Businesses.",
        features: [
            "Social Media: 3 Platforms (IG, FB, TikTok)",
            "3-5 Posts per week (Graphics + Reels)",
            "Daily Stories",
            "Community Management (Replier)",
            "Basic Captioning & Hashtags"
        ],
        cta: "Get Started",
        popular: false,
        color: "bg-zeniac-charcoal",
        border: "border-white/10"
    },
    {
        name: "The 'Zenith'",
        id: "zenith",
        href: "mailto:merchzenith@gmail.com?subject=Plan Inquiry",
        price: { KES: "30K - 50K", USD: "240 - 400" },
        description: "Growth & Automation for scaling businesses.",
        features: [
            "All Platforms (IG, FB, TikTok, X, LinkedIn, YouTube)",
            "3-5 High-Quality Posts per week",
            "Automations (Chatbots, Auto-replies)",
            "Direct Outreach Strategies",
            "WhatsApp Catalog & Broadcasts"
        ],
        cta: "Scale Now",
        popular: true,
        color: "bg-zeniac-black",
        border: "border-zeniac-gold"
    },
    {
        name: "The 'Brainiac'",
        id: "brainiac",
        href: "mailto:merchzenith@gmail.com?subject=Plan Inquiry",
        price: { KES: "CUSTOM", USD: "CUSTOM" },
        description: "Complete digital transformation & high-end storytelling.",
        features: [
            "Everything in Zenith + Premium Execution",
            "Storytelling E-Commerce Website",
            "Deep-dive Business Strategy",
            "Total Digital Dominance"
        ],
        cta: "Contact Us",
        popular: false,
        color: "bg-zeniac-white/5",
        border: "border-white/10"
    },
];

const addons = [
    "Ads Management (Budget + Fee)",
    "Branding & Identity (Logos, Kits)",
    "Web Design & Development",
    "Google Business Profile Optimization",
    "WhatsApp Business Setup",
    "Local Competitor 'Spy' Report",
    "Localized Hashtag Vault",
    "QR Code Generation"
];

export function Pricing({ onOpenBooking }: { onOpenBooking?: (data?: any) => void }) {
    const [currency, setCurrency] = useState<"KES" | "USD">("KES");
    const [freeDialogOpen, setFreeDialogOpen] = useState(false);

    return (
        <section className="py-24 relative overflow-hidden" id="pricing">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white mb-6">
                        INVEST IN <span className="text-zeniac-gold">DOMINANCE</span>
                    </h2>
                    <p className="text-muted-foreground font-mono text-lg mb-10">
                        Contract-based pricing determined by your specific goals. No hidden fees, just results.
                    </p>

                    {/* Currency Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={cn("text-sm font-mono transition-colors", currency === "KES" ? "text-zeniac-gold" : "text-muted-foreground")}>KES</span>
                        <button
                            onClick={() => setCurrency(prev => prev === "KES" ? "USD" : "KES")}
                            className="relative w-14 h-7 rounded-full bg-zeniac-charcoal border border-white/10 p-1 transition-colors hover:border-zeniac-gold/50"
                        >
                            <motion.div
                                animate={{ x: currency === "KES" ? 0 : 28 }}
                                className="w-5 h-5 rounded-full bg-zeniac-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                            />
                        </button>
                        <span className={cn("text-sm font-mono transition-colors", currency === "USD" ? "text-zeniac-gold" : "text-muted-foreground")}>USD</span>
                    </div>
                </div>

                <div className="mobile-carousel md:flex md:flex-wrap md:justify-center gap-6 max-w-7xl mx-auto mb-16">
                    {tiers.map((tier) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                                "relative flex flex-col p-6 rounded-xl border transition-all duration-300 w-[80vw] md:w-auto",
                                tier.border,
                                tier.color,
                                tier.popular ? "shadow-[0_0_30px_rgba(255,215,0,0.1)] scale-105 z-10" : "hover:border-zeniac-gold/30"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-zeniac-gold text-zeniac-black text-xs font-mono font-bold rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-typewriter font-black text-zeniac-white mb-2">{tier.name}</h3>
                                <p className="text-sm text-muted-foreground min-h-[40px]">{tier.description}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-mono text-zeniac-gold mr-1">{currency === "KES" ? "KES" : "$"}</span>
                                    <span className="text-3xl font-bold text-zeniac-gold font-mono">
                                        {tier.price[currency]}
                                    </span>
                                </div>
                                {tier.price.KES !== "FREE" && tier.price.KES !== "CUSTOM" && (
                                    <p className="text-xs text-muted-foreground mt-1">Contract Based</p>
                                )}
                            </div>

                            <ul className="mb-6 space-y-3 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm text-zeniac-white/80">
                                        <Check className="w-4 h-4 text-zeniac-gold shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {(tier as any).isFree ? (
                                <Dialog open={freeDialogOpen} onOpenChange={setFreeDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full font-mono font-bold border-zeniac-gold text-zeniac-gold hover:bg-zeniac-gold hover:text-zeniac-black"
                                        >
                                            {tier.cta} <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zeniac-charcoal border-white/10 text-white rounded-none sm:max-w-[450px]">
                                        <DialogHeader>
                                            <DialogTitle className="font-typewriter text-2xl font-black uppercase text-zeniac-gold">
                                                Claim Your Free Audit
                                            </DialogTitle>
                                            <DialogDescription className="font-mono text-muted-foreground">
                                                Enter your email to receive your free Digital Dominance Audit and strategy call.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <LeadForm serviceId="free-audit" resourceName="Digital Dominance Audit" />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Button
                                    variant={tier.popular ? "default" : "outline"}
                                    className={cn(
                                        "w-full font-mono font-bold border-zeniac-gold text-zeniac-gold hover:bg-zeniac-gold hover:text-zeniac-black",
                                        tier.popular && "bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90"
                                    )}
                                    onClick={() => onOpenBooking?.({ project: tier.name })}
                                >
                                    {tier.cta} <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}

                            {/* Background gradient for glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zeniac-gold/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto rounded-xl border border-white/10 bg-zeniac-charcoal/30 p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-mono font-bold text-zeniac-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-zeniac-gold" />
                        ADD-ONS & SWEETENERS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addons.map((addon) => (
                            <div key={addon} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <Star className="w-4 h-4 text-zeniac-gold shrink-0" />
                                <span className="text-sm font-mono text-zeniac-white/90">{addon}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
