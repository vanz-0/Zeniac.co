"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "@/components/marketing/lead-form";
import { cn } from "@/lib/utils";
import {
    Calendar, Video, MessageSquare, Calculator, Target, Map, Mail,
    Star, Palette, Hash, Users, FileText, AtSign, DollarSign,
    BarChart3, Sparkles, Search, Zap, Flame, Clock, ArrowDownAZ,
} from "lucide-react";

type SortMode = "popular" | "recent" | "az";

const templates = [
    { id: "content-calendar", title: "30-Day Content Calendar", tag: "Content", icon: Calendar, popularity: 98, addedDate: "2026-02-16", description: "Industry-tailored posting plan with hooks & hashtags" },
    { id: "reel-scripts", title: "Instagram Reel Scripts", tag: "Content", icon: Video, popularity: 95, addedDate: "2026-02-15", description: "10 ready-to-shoot scripts with viral hooks" },
    { id: "viral-hooks", title: "200 Viral Hooks & Captions", tag: "Content", icon: MessageSquare, popularity: 92, addedDate: "2026-02-14", description: "Scroll-stopping openers for any platform" },
    { id: "revenue-calc", title: "Revenue Leak Calculator", tag: "Analytics", icon: Calculator, popularity: 88, addedDate: "2026-02-13", description: "See exactly how much revenue you're leaking" },
    { id: "competitor-spy", title: "Competitor Spy Tracker", tag: "Analytics", icon: Target, popularity: 90, addedDate: "2026-02-12", description: "Monitor competitor moves, pricing & gaps" },
    { id: "gbp-checklist", title: "GBP Optimization Checklist", tag: "SEO", icon: Map, popularity: 72, addedDate: "2026-02-11", description: "15-point checklist to rank in the Map Pack" },
    { id: "whatsapp-templates", title: "WhatsApp Auto-Reply Templates", tag: "Automation", icon: MessageSquare, popularity: 85, addedDate: "2026-02-10", description: "Auto-reply & broadcast message templates" },
    { id: "email-templates", title: "Email Newsletter Templates", tag: "Outreach", icon: Mail, popularity: 80, addedDate: "2026-02-09", description: "5 newsletter & drip sequence templates" },
    { id: "testimonial-scripts", title: "Testimonial Request Scripts", tag: "Outreach", icon: Star, popularity: 68, addedDate: "2026-02-08", description: "Get 5-star reviews on autopilot" },
    { id: "brand-voice", title: "Brand Voice Guide", tag: "Branding", icon: Palette, popularity: 75, addedDate: "2026-02-07", description: "Define your tone, vocabulary & personality" },
    { id: "hashtag-vault", title: "Hashtag Strategy Vault (500)", tag: "Content", icon: Hash, popularity: 86, addedDate: "2026-02-06", description: "Industry-specific hashtag strategy" },
    { id: "crm-tracker", title: "Simple CRM Tracker", tag: "Automation", icon: Users, popularity: 70, addedDate: "2026-02-05", description: "Track leads from first touch to close" },
    { id: "website-copy", title: "Website Copy Framework", tag: "Branding", icon: FileText, popularity: 82, addedDate: "2026-02-04", description: "Conversion-optimized copy templates" },
    { id: "bio-optimizer", title: "Social Media Bio Optimizer", tag: "Content", icon: AtSign, popularity: 65, addedDate: "2026-02-03", description: "Bio templates that actually convert" },
    { id: "pricing-calc", title: "Pricing Strategy Calculator", tag: "Analytics", icon: DollarSign, popularity: 77, addedDate: "2026-02-02", description: "Data-driven pricing for your market" },
    { id: "analytics-dash", title: "Weekly Analytics Dashboard", tag: "Analytics", icon: BarChart3, popularity: 73, addedDate: "2026-02-01", description: "KPI tracking spreadsheet" },
    { id: "brand-kit", title: "Canva Brand Kit Guide", tag: "Branding", icon: Sparkles, popularity: 60, addedDate: "2026-01-31", description: "Visual brand guidelines for Canva" },
    { id: "seo-keywords", title: "SEO Keyword Starter Pack", tag: "SEO", icon: Search, popularity: 87, addedDate: "2026-01-30", description: "High-intent keywords for your niche" },
    { id: "journey-map", title: "Customer Journey Map", tag: "Analytics", icon: Map, popularity: 62, addedDate: "2026-01-29", description: "Visualize your customer's path to purchase" },
    { id: "automations", title: "3 No-Code Automation Workflows", tag: "Automation", icon: Zap, popularity: 78, addedDate: "2026-01-28", description: "Apps Script automations you can copy-paste" },
];

const TAGS = ["All", "Content", "Analytics", "SEO", "Branding", "Outreach", "Automation"];

const tagColors: Record<string, string> = {
    Content: "text-purple-400",
    Analytics: "text-blue-400",
    SEO: "text-green-400",
    Branding: "text-pink-400",
    Outreach: "text-orange-400",
    Automation: "text-cyan-400",
};

export function SearchDominance() {
    const [sortMode, setSortMode] = useState<SortMode>("popular");
    const [activeTag, setActiveTag] = useState("All");

    const sorted = useMemo(() => {
        const filtered = activeTag === "All"
            ? [...templates]
            : templates.filter(t => t.tag === activeTag);

        return filtered.sort((a, b) => {
            switch (sortMode) {
                case "popular": return b.popularity - a.popularity;
                case "recent": return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
                case "az": return a.title.localeCompare(b.title);
                default: return 0;
            }
        });
    }, [sortMode, activeTag]);

    return (
        <div className="w-full h-full p-6 bg-zinc-900/50 flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-zeniac-gold uppercase tracking-wider">
                        Free Resources
                    </span>
                    <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <h3 className="text-xl font-bold font-typewriter text-zinc-100 mb-1">
                    Dominance Templates
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Battle-tested systems you can swipe and deploy today.
                </p>
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-1.5 mb-3">
                {([
                    { mode: "popular" as SortMode, icon: Flame, label: "Popular" },
                    { mode: "recent" as SortMode, icon: Clock, label: "Recent" },
                    { mode: "az" as SortMode, icon: ArrowDownAZ, label: "A–Z" },
                ]).map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => setSortMode(mode)}
                        className={cn(
                            "flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider border rounded-full transition-all duration-200",
                            sortMode === mode
                                ? "border-zeniac-gold/50 bg-zeniac-gold/10 text-zeniac-gold"
                                : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                        )}
                    >
                        <Icon className="w-3 h-3" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1 mb-4">
                {TAGS.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={cn(
                            "px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider border rounded transition-all duration-200",
                            activeTag === tag
                                ? "border-zeniac-gold/40 bg-zeniac-gold/5 text-zeniac-gold"
                                : "border-zinc-800/50 text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="space-y-1">
                    <AnimatePresence mode="popLayout">
                        {sorted.map((template, idx) => {
                            const Icon = template.icon;
                            return (
                                <Dialog key={template.id}>
                                    <DialogTrigger asChild>
                                        <motion.button
                                            layout
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15, delay: idx * 0.02 }}
                                            className="w-full group flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all text-left px-2 rounded-md"
                                        >
                                            {/* Number / Icon */}
                                            <div className="w-8 h-8 rounded bg-zinc-800 overflow-hidden shrink-0 relative flex items-center justify-center">
                                                <div className="absolute inset-0 bg-zeniac-gold/5 group-hover:bg-zeniac-gold/10 transition-colors" />
                                                <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zeniac-gold transition-colors relative z-10" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-xs font-bold text-zinc-300 group-hover:text-zeniac-gold truncate transition-colors">
                                                        {template.title}
                                                    </h4>
                                                    {sortMode === "popular" && template.popularity >= 85 && (
                                                        <span className="text-[8px] font-mono text-orange-400 shrink-0">
                                                            🔥
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[9px] text-zinc-500 truncate">
                                                    <span className={cn("uppercase tracking-tighter", tagColors[template.tag] || "text-zinc-500")}>
                                                        {template.tag}
                                                    </span>
                                                    <span className="mx-1 text-zinc-700">—</span>
                                                    {template.description}
                                                </p>
                                            </div>

                                            {/* Download badge */}
                                            <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full group-hover:border-zeniac-gold/30 group-hover:text-zeniac-gold transition-colors shrink-0">
                                                DOWNLOAD
                                            </span>
                                        </motion.button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-900">
                                        <LeadForm
                                            serviceId="resource-download"
                                            resourceName={template.title}
                                        />
                                    </DialogContent>
                                </Dialog>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer count */}
            <div className="mt-3 pt-2 border-t border-zinc-800/50 text-center">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                    {sorted.length} of {templates.length} templates
                    {activeTag !== "All" && ` in ${activeTag}`}
                </span>
            </div>
        </div>
    );
}
