"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Lock,
    Unlock,
    Calendar,
    Video,
    MessageSquare,
    Calculator,
    Search,
    Target,
    Map,
    Mail,
    Star,
    Palette,
    Hash,
    Users,
    FileText,
    AtSign,
    DollarSign,
    BarChart3,
    Sparkles,
    Zap,
    X,
    ArrowRight,
    Shield,
    Check,
} from "lucide-react";
import { ToolkitSurvey, SurveyData } from "./toolkit-survey";

// Category-to-gradient map: Gold / Purple / Black palette
const categoryGradients: Record<string, string> = {
    Content: "from-zeniac-gold/20 to-yellow-600/10",
    Analytics: "from-purple-500/20 to-indigo-600/10",
    Growth: "from-zeniac-gold/15 to-purple-500/15",
    Branding: "from-purple-900/30 to-zeniac-gold/10",
    Automation: "from-indigo-500/20 to-purple-900/20",
};

const vaultTools = [
    { name: "Content Calendar", icon: Calendar, category: "Content", personalized: true },
    { name: "Reel Scripts (10)", icon: Video, category: "Content", personalized: true },
    { name: "200 Viral Hooks", icon: MessageSquare, category: "Content", personalized: false },
    { name: "Revenue Calculator", icon: Calculator, category: "Analytics", personalized: true },
    { name: "Competitor Tracker", icon: Target, category: "Analytics", personalized: true },
    { name: "GBP Checklist", icon: Map, category: "Growth", personalized: false },
    { name: "WhatsApp Templates", icon: MessageSquare, category: "Automation", personalized: false },
    { name: "Email Templates (5)", icon: Mail, category: "Automation", personalized: false },
    { name: "Testimonial Scripts", icon: Star, category: "Growth", personalized: false },
    { name: "Brand Voice Guide", icon: Palette, category: "Branding", personalized: false },
    { name: "Hashtag Vault (500)", icon: Hash, category: "Content", personalized: true },
    { name: "CRM Tracker", icon: Users, category: "Automation", personalized: false },
    { name: "Website Copy", icon: FileText, category: "Branding", personalized: true },
    { name: "Bio Optimizer", icon: AtSign, category: "Content", personalized: false },
    { name: "Pricing Calculator", icon: DollarSign, category: "Analytics", personalized: false },
    { name: "Analytics Dashboard", icon: BarChart3, category: "Analytics", personalized: false },
    { name: "Slides Brand Kit", icon: Sparkles, category: "Branding", personalized: false },
    { name: "SEO Keyword Pack", icon: Search, category: "Growth", personalized: true },
    { name: "Journey Map", icon: Map, category: "Growth", personalized: false },
    { name: "Apps Script Automations", icon: Zap, category: "Automation", personalized: false },
];

const categories = ["All", "Content", "Analytics", "Growth", "Branding", "Automation"];

export function DominanceVault() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [currency, setCurrency] = useState<"KES" | "USD">("KES");
    const [showSurvey, setShowSurvey] = useState(false);
    const [showAllTools, setShowAllTools] = useState(false);
    const [showPayment, setShowPayment] = useState(false);


    const handleSurveyComplete = async (data: SurveyData) => {
        console.log("Generating tools for:", data);

        // Call Modal Webhook
        const modalUrl = process.env.NEXT_PUBLIC_MODAL_URL;
        if (modalUrl) {
            try {
                // Call generate-toolkit webhook on Modal
                await fetch(`${modalUrl}?slug=generate-toolkit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data })
                });
                alert(`Toolkit generation started! Check your email (${data.email}) in 2-3 minutes.`);
            } catch (e) {
                console.error("Generation failed:", e);
                alert("Started generation (simulated). Check email shortly.");
            }
        } else {
            // Mock success for demo
            setTimeout(() => {
                alert(`[DEMO] Toolkit generation started for ${data.industry}! Real generation requires NEXT_PUBLIC_MODAL_URL.`);
            }, 1000);
        }
        setShowSurvey(false);
    };

    const filtered = activeCategory === "All"
        ? vaultTools
        : vaultTools.filter(t => t.category === activeCategory);

    const displayedTools = showAllTools ? filtered : filtered.slice(0, 4);

    return (
        <section className="py-24 relative overflow-hidden" id="vault">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zeniac-gold/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zeniac-gold/30 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-zeniac-gold/30 bg-zeniac-gold/5 mb-6"
                    >
                        <Shield className="w-4 h-4 text-zeniac-gold" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zeniac-gold">
                            Not ready for our plans? Start here.
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white mb-4 uppercase"
                    >
                        THE <span className="text-zeniac-gold">DOMINANCE</span> VAULT
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground font-mono text-lg mb-2"
                    >
                        20 tools, templates, scripts & automations — everything our
                        KES 50K clients use — for the price of lunch.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-xs font-mono text-zeniac-gold/60"
                    >
                        Personalized to YOUR business using AI analysis
                    </motion.p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all duration-300",
                                activeCategory === cat
                                    ? "border-zeniac-gold bg-zeniac-gold/10 text-zeniac-gold"
                                    : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Tool Grid */}
                <div className={cn(
                    "grid grid-cols-2 gap-3 max-w-5xl mx-auto mb-12",
                    showAllTools
                        ? "sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                        : "sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
                )}>
                    {displayedTools.map((tool, i) => {
                        const Icon = tool.icon;
                        const gradient = categoryGradients[tool.category] || "from-white/5 to-white/5";
                        return (
                            <div
                                key={tool.name}
                                className={cn(
                                    "group relative flex flex-col items-center justify-center p-5 border transition-all duration-300 cursor-default aspect-square",
                                    "bg-zeniac-charcoal/30",
                                    "border-white/10 hover:border-zeniac-gold/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.08)] hover:-translate-y-1"
                                )}
                            >
                                {/* Lock/unlock icon overlay */}
                                <div className="absolute top-2 right-2">
                                    <Lock className="w-3 h-3 text-white/20 group-hover:hidden" />
                                    <Unlock className="w-3 h-3 text-zeniac-gold/60 hidden group-hover:block" />
                                </div>

                                {/* Personalized badge */}
                                {tool.personalized && (
                                    <div className="absolute top-2 left-2">
                                        <Sparkles className="w-3 h-3 text-zeniac-gold/40" />
                                    </div>
                                )}

                                {/* Tool Visual — category-colored gradient */}
                                <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br border border-white/10 transition-colors duration-300 group-hover:border-zeniac-gold/50",
                                        gradient
                                    )}>
                                        <Icon className="w-5 h-5 text-white/40 transition-colors duration-300 group-hover:text-zeniac-gold" />
                                    </div>
                                </div>

                                <span className="text-[10px] font-mono text-center uppercase tracking-wide leading-tight transition-colors duration-300 text-white/40 group-hover:text-zeniac-white">
                                    {tool.name}
                                </span>

                                {/* Category tag */}
                                <span className="mt-2 text-[8px] font-mono uppercase px-2 py-0.5 border transition-all duration-300 border-white/5 text-white/20 group-hover:border-zeniac-gold/30 group-hover:text-zeniac-gold/60">
                                    {tool.category}
                                </span>

                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-zeniac-gold/5 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100" />
                            </div>
                        );
                    })}
                </div>

                {/* Toggle Button */}
                {filtered.length > 4 && (
                    <div className="flex justify-center mb-12 -mt-6 relative z-10">
                        {!showAllTools && (
                            <div className="absolute inset-x-0 bottom-full h-24 bg-gradient-to-t from-zeniac-black to-transparent pointer-events-none" />
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setShowAllTools(!showAllTools)}
                            className="bg-zeniac-black/80 backdrop-blur border-zeniac-gold/30 text-zeniac-gold hover:bg-zeniac-gold/10 font-mono text-xs uppercase tracking-widest"
                        >
                            {showAllTools ? (
                                <>Show Less <ArrowRight className="w-3 h-3 ml-2 rotate-180" /></>
                            ) : (
                                <>View All {filtered.length} Tools <ArrowRight className="w-3 h-3 ml-2" /></>
                            )}
                        </Button>
                    </div>
                )}

                {/* CTA Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-xl mx-auto"
                >
                    <div className="relative">
                        <div className="absolute -inset-1 bg-zeniac-gold/10 blur-xl pointer-events-none" />
                        <div className="relative border border-zeniac-gold/30 bg-black/60 backdrop-blur-sm p-8 text-center">
                            {/* Price */}
                            <div className="mb-4">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <button
                                        onClick={() => setCurrency("KES")}
                                        className={cn(
                                            "text-xs font-mono transition-colors",
                                            currency === "KES" ? "text-zeniac-gold" : "text-white/40"
                                        )}
                                    >
                                        KES
                                    </button>
                                    <button
                                        onClick={() => setCurrency(prev => prev === "KES" ? "USD" : "KES")}
                                        className="relative w-10 h-5 bg-zeniac-charcoal border border-white/10 p-0.5"
                                    >
                                        <motion.div
                                            animate={{ x: currency === "KES" ? 0 : 20 }}
                                            className="w-4 h-4 bg-zeniac-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                                        />
                                    </button>
                                    <button
                                        onClick={() => setCurrency("USD")}
                                        className={cn(
                                            "text-xs font-mono transition-colors",
                                            currency === "USD" ? "text-zeniac-gold" : "text-white/40"
                                        )}
                                    >
                                        USD
                                    </button>
                                </div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-sm font-mono text-zeniac-gold">
                                        {currency === "KES" ? "KES" : "$"}
                                    </span>
                                    <span className="text-4xl font-typewriter font-black text-zeniac-gold">
                                        {currency === "KES" ? "3,000" : "20"}
                                    </span>
                                </div>
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
                                    One-time. Yours forever.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-6 text-xs font-mono text-white/50">
                                <span>✦ 20 tools</span>
                                <span>✦ AI personalized</span>
                                <span>✦ Google Workspace native</span>
                                <span>✦ Instant delivery</span>
                            </div>

                            <Button
                                className="w-full bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-typewriter font-black uppercase py-6 text-base tracking-tight transition-all hover:scale-[1.02] active:scale-[0.98] rounded-none"
                                onClick={() => {
                                    // Start mock payment flow
                                    setShowPayment(true);
                                }}
                            >
                                UNLOCK THE VAULT <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>

                            <p className="text-[10px] font-mono text-white/30 mt-3">
                                Backed by our 100% satisfaction guarantee
                            </p>
                        </div>
                    </div>
                </motion.div>

                <ToolkitSurvey
                    isOpen={showSurvey}
                    onClose={() => setShowSurvey(false)}
                    onComplete={handleSurveyComplete}
                />

                <PaymentSimulation
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    onSuccess={() => {
                        setShowPayment(false);
                        setShowSurvey(true);
                    }}
                />
            </div>
        </section>
    );
}

function PaymentSimulation({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const [step, setStep] = useState<"processing" | "success">("processing");

    useEffect(() => {
        if (isOpen) {
            setStep("processing");
            // Simulate Payment Gateway delay
            const timer1 = setTimeout(() => {
                setStep("success");
            }, 2500);

            // Simulate Redirect back
            const timer2 = setTimeout(() => {
                onSuccess();
            }, 4000); // 1.5s success message

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isOpen, onSuccess]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-zeniac-black border border-white/10 p-8 max-w-sm w-full text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />

                        {step === "processing" ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-2 border-zeniac-gold border-t-transparent rounded-full animate-spin" />
                                <div>
                                    <h3 className="font-typewriter font-bold text-lg text-white mb-1">
                                        SECURE CHECKOUT
                                    </h3>
                                    <p className="font-mono text-xs text-white/50">Processing payment...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                                    <Check className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-typewriter font-bold text-lg text-white mb-1">
                                        PAYMENT SUCCESSFUL
                                    </h3>
                                    <p className="font-mono text-xs text-white/50">Redirecting to toolkit setup...</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

/**
 * Vault Popup Modal — triggered on return visits or email link with ?vault=open
 */
export function VaultPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check URL param
        const params = new URLSearchParams(window.location.search);
        if (params.get("vault") === "open") {
            setIsOpen(true);
            return;
        }

        // Check return visitor (second visit)
        const visitCount = parseInt(localStorage.getItem("zeniac_visits") || "0", 10);
        localStorage.setItem("zeniac_visits", String(visitCount + 1));

        // Show popup on 2nd+ visit, after 5 seconds, if not dismissed before
        if (visitCount >= 1 && !localStorage.getItem("zeniac_vault_dismissed")) {
            const timer = setTimeout(() => setIsOpen(true), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem("zeniac_vault_dismissed", "true");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md border border-zeniac-gold/40 bg-zeniac-black/95 backdrop-blur-md p-8"
                    >
                        {/* Close */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Glow */}
                        <div className="absolute -inset-px bg-gradient-to-b from-zeniac-gold/20 via-transparent to-zeniac-gold/10 pointer-events-none" />

                        <div className="relative">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 border border-zeniac-gold/30 bg-zeniac-gold/5 mb-4">
                                    <Sparkles className="w-3 h-3 text-zeniac-gold" />
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-zeniac-gold">
                                        Exclusive Offer
                                    </span>
                                </div>

                                <h3 className="text-2xl font-typewriter font-black text-zeniac-white uppercase mb-2">
                                    THE <span className="text-zeniac-gold">DOMINANCE</span> VAULT
                                </h3>

                                <p className="text-sm font-mono text-muted-foreground">
                                    20 AI-personalized tools, templates & automations.
                                    Everything you need to dominate your market.
                                </p>
                            </div>

                            {/* Mini tool preview */}
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {vaultTools.slice(0, 8).map((tool) => {
                                    const Icon = tool.icon;
                                    return (
                                        <div
                                            key={tool.name}
                                            className="flex flex-col items-center p-2 border border-white/5 bg-white/[0.02]"
                                        >
                                            <Icon className="w-4 h-4 text-white/30 mb-1" />
                                            <span className="text-[7px] font-mono text-white/30 text-center leading-tight truncate w-full">
                                                {tool.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-center text-[10px] font-mono text-white/40 mb-4">
                                ...and 12 more tools
                            </p>

                            {/* Price + CTA */}
                            <div className="text-center mb-4">
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                    <span className="text-sm font-mono text-zeniac-gold">KES</span>
                                    <span className="text-3xl font-typewriter font-black text-zeniac-gold">3,000</span>
                                    <span className="text-sm font-mono text-white/40 ml-1">/ $20</span>
                                </div>
                                <p className="text-[10px] font-mono text-white/40">One-time purchase</p>
                            </div>

                            <Button
                                className="w-full bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-typewriter font-black uppercase py-5 tracking-tight transition-all hover:scale-[1.02] active:scale-[0.98] rounded-none"
                                onClick={() => {
                                    handleDismiss();
                                    document.getElementById("vault")?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                UNLOCK THE VAULT <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>

                            <button
                                onClick={handleDismiss}
                                className="w-full mt-3 text-[10px] font-mono text-white/30 hover:text-white/50 transition-colors uppercase tracking-widest"
                            >
                                Maybe later
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
