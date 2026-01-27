"use client";

import { cn } from "@/lib/utils";
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

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

interface BentoGridProps {
    items?: BentoItem[];
}

const itemsSample: BentoItem[] = [
    {
        title: "Visual Identity",
        meta: "Design",
        description:
            "Crafting a high-end local presence. We design logos, menus, and signage that signal premium quality to your customers.",
        icon: <Palette className="w-5 h-5 text-zeniac-gold" />,
        status: "Premium",
        tags: ["Logo", "Print", "Signage"],
        colSpan: 2,
        hasPersistentHover: true,
    },
    {
        title: "Local SEO Dominance",
        meta: "Growth",
        description: "Ranking your business #1 on Google Maps. We optimize your profile to capture every local search.",
        icon: <Globe className="w-5 h-5 text-zeniac-gold" />,
        status: "Essential",
        tags: ["GMB", "Maps", "Reviews"],
    },
    {
        title: "Content Creation",
        meta: "Social",
        description: "Professional photography and videography that showcases your products and services.",
        icon: <Smartphone className="w-5 h-5 text-zeniac-gold" />,
        tags: ["Reels", "TikTok", "Photos"],
        colSpan: 1,
    },
    {
        title: "Reputation Management",
        meta: "Trust",
        description: "Automated systems to generate 5-star reviews and manage customer feedback.",
        icon: <TrendingUp className="w-5 h-5 text-zeniac-gold" />,
        status: "Live",
        tags: ["Reviews", "Trust"],
        colSpan: 2,
    },
    {
        title: "Paid Advertising",
        meta: "Traffic",
        description: "Targeted localized ads that bring walk-in customers to your door.",
        icon: <Megaphone className="w-5 h-5 text-zeniac-gold" />,
        colSpan: 3,
        tags: ["Ads", "Leads"],
    },
];

export function BentoGrid({ items = itemsSample }: BentoGridProps) {
    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-mono font-bold text-zeniac-white mb-6">
                    OUR <span className="text-zeniac-gold">SERVICES</span>
                </h2>
                <p className="text-muted-foreground font-mono max-w-2xl mx-auto">
                    We combine aesthetic excellence with technical rigor to build brands that dominate their category.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            "group relative p-6 rounded-none overflow-hidden transition-all duration-300",
                            "border border-white/10 bg-zeniac-charcoal/30 backdrop-blur-sm",
                            "hover:border-zeniac-gold/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]",
                            "hover:-translate-y-1 will-change-transform",
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
                                <h3 className="text-2xl md:text-3xl font-mono font-bold text-zeniac-white tracking-tight flex items-center">
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
                                <span className="text-sm font-bold text-zeniac-gold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    {item.cta || "→"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
