import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    BarChart,
    Brain,
    Megaphone,
    Palette,
    Rocket,
    Smartphone,
    TrendingUp,
    Globe,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "./lead-form";
import { FREEBIES } from "@/config/freebies";
import { Button } from "@/components/ui/button";

export interface BentoItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
    portfolioUrl?: string;
}

interface BentoGridProps {
    items?: BentoItem[];
}

const itemsSample: BentoItem[] = [
    {
        id: "visual-identity",
        title: "Visual Identity",
        meta: "Dominance",
        description:
            "Design that signals premium authority. We engineer logos, high-fidelity menu systems, and signage meant to command attention.",
        icon: <Palette className="w-5 h-5 text-zeniac-gold" />,
        status: "High-End",
        tags: ["Branding", "Signage", "Print"],
        colSpan: 2,
        hasPersistentHover: true,
        cta: "View Portfolio",
        portfolioUrl: "https://drive.google.com/drive/folders/1imRV5zug3IlVkkKNhOm8K6pZYbpvaY2A",
    },
    {
        id: "seo-optimization",
        title: "Local SEO Dominance",
        meta: "Visibility",
        description: "Google Maps 3-pack engineering. We optimize your local profile to capture every high-intent search in your radius.",
        icon: <Globe className="w-5 h-5 text-zeniac-gold" />,
        status: "Priority",
        tags: ["GMB", "Maps", "Reviews"],
        cta: "View Portfolio",
        portfolioUrl: "https://drive.google.com/drive/folders/1aZCBosvYmuBQ_VRQvNnTbSFWmia7fx_E",
    },
    {
        id: "content-creation",
        title: "Content Firepower",
        meta: "Social",
        description: "30-day strategic calendars and high-conversion video assets (Reels/TikTok) designed to turn attention into currency.",
        icon: <Smartphone className="w-5 h-5 text-zeniac-gold" />,
        tags: ["4K Video", "Strategy", "Reels"],
        colSpan: 1,
        cta: "View Portfolio",
        portfolioUrl: "https://drive.google.com/drive/folders/1FSEk8ZS8PW-s8YY08BhiS2PpxTdSJ6zw",
    },
    {
        id: "business-intelligence",
        title: "Reputation Engineering",
        meta: "Trust",
        description: "Automated 5-star review loops and aggressive sentiment management to build an unshakable wall of social proof.",
        icon: <TrendingUp className="w-5 h-5 text-zeniac-gold" />,
        status: "Live",
        tags: ["Trust", "Automation", "Proof"],
        colSpan: 2,
        cta: "View Portfolio",
        portfolioUrl: "https://drive.google.com/drive/folders/161njPp1CIeEBnC82wzFStv_4Y1Aj50VL",
    },
    {
        id: "paid-advertising",
        title: "Paid Acquisition",
        meta: "Traffic",
        description: "Localized, ROI-tracked ad campaigns that drive physical walk-ins and digital bookings with surgical precision.",
        icon: <Megaphone className="w-5 h-5 text-zeniac-gold" />,
        colSpan: 1,
        tags: ["Search Ads", "Meta Ads"],
        cta: "View Portfolio",
        portfolioUrl: "https://drive.google.com/drive/folders/1_pAhSmxCiRi2XDgIVqqJPNdpMohJN6q4",
    },
    {
        id: "ai-automations",
        title: "AI & Workflows",
        meta: "Efficiency",
        description: "Intelligent LLM agent integration and DOE-layered automations that 10x your capacity while you focus on growth.",
        icon: <Brain className="w-5 h-5 text-zeniac-gold" />,
        colSpan: 2,
        tags: ["Agents", "Workflows", "Scale"],
        cta: "View Portfolio",
        portfolioUrl: "https://drive.google.com/drive/folders/1JyfIIa1S-V1xzoUkXj-G0mOLnwb1qt0L",
    },
];

export function BentoGrid({ items = itemsSample }: BentoGridProps) {
    const [selectedService, setSelectedService] = useState<BentoItem | null>(null);
    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 mb-16 text-center">
                <h2 className="text-4xl md:text-6xl font-typewriter font-black text-zeniac-white mb-6 uppercase">
                    OUR <span className="text-zeniac-gold">SERVICES</span>
                </h2>
                <p className="text-muted-foreground font-mono text-lg max-w-2xl mx-auto">
                    Precise digital engineering and creative firepower. We don't just "do marketing"—we build systems for market dominance.
                </p>
            </div>

            <Dialog onOpenChange={(open) => !open && setSelectedService(null)}>
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group relative p-8 rounded-none overflow-hidden transition-all duration-500",
                                "border border-white/10 bg-zeniac-charcoal/50 backdrop-blur-sm",
                                "hover:border-zeniac-gold/50 hover:shadow-[0_0_50px_rgba(255,215,0,0.1)]",
                                "hover:-translate-y-2 will-change-transform",
                                item.colSpan || "col-span-1",
                                item.colSpan === 2 ? "md:col-span-2" : item.colSpan === 3 ? "md:col-span-3" : "",
                                {
                                    "border-zeniac-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.05)]":
                                        item.hasPersistentHover,
                                }
                            )}
                        >
                            <div
                                className={`absolute inset-0 ${item.hasPersistentHover
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                                    } transition-opacity duration-500`}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_1px,transparent_1px)] bg-[length:4px_4px]" />
                            </div>

                            <div className="relative flex flex-col space-y-4 h-full justify-between">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-none flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-zeniac-gold/10 group-hover:border-zeniac-gold/30 transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] font-mono uppercase tracking-wider px-2 py-1 border",
                                            "bg-transparent border-white/20 text-white/60",
                                            "transition-colors duration-300 group-hover:border-zeniac-gold/50 group-hover:text-zeniac-gold"
                                        )}
                                    >
                                        {item.status || "Ready"}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-2xl md:text-3xl font-typewriter font-black text-zeniac-white tracking-tight flex items-center">
                                        {item.title}
                                    </h3>
                                    <p className="text-base md:text-lg text-muted-foreground font-mono leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {item.tags?.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 text-[10px] uppercase font-mono bg-white/5 text-white/40 group-hover:text-white/70 transition-colors"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {item.portfolioUrl ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="font-mono text-[10px] uppercase border-zeniac-gold/30 text-zeniac-gold hover:bg-zeniac-gold hover:text-black rounded-none px-4 h-8 transition-all duration-300"
                                        >
                                            <a href={item.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                                {item.cta}
                                            </a>
                                        </Button>
                                    ) : item.cta ? (
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedService(item)}
                                                className="font-mono text-[10px] uppercase border-zeniac-gold/30 text-zeniac-gold hover:bg-zeniac-gold hover:text-black rounded-none px-4 h-8 transition-all duration-300"
                                            >
                                                {item.cta}
                                            </Button>
                                        </DialogTrigger>
                                    ) : (
                                        <div className="w-6 h-6 border-r border-b border-zeniac-gold/20 group-hover:border-zeniac-gold transition-colors" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogContent className="bg-zeniac-charcoal border-white/10 text-white rounded-none sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="font-typewriter text-2xl font-black uppercase text-zeniac-gold">
                            Access Granted
                        </DialogTitle>
                        <DialogDescription className="font-mono text-muted-foreground">
                            Enter your transmission details to receive the 100% free asset for <strong>{selectedService?.title}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedService && (
                        <div className="py-4">
                            <LeadForm
                                serviceId={selectedService.id}
                                resourceName={FREEBIES[selectedService.id as keyof typeof FREEBIES]?.name || "Strategic Asset"}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
