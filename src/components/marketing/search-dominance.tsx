"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "@/components/marketing/lead-form";
import { cn } from "@/lib/utils";

const templates = [
    {
        id: "lsa-tracker",
        title: "LSA Budget Tracker",
        description: "Google Sheets template to track Local Service Ads spend vs. actual booked revenue.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
        tag: "Finance"
    },
    {
        id: "review-generation",
        title: "Review Gen. Script",
        description: "Copy-paste SMS/Email scripts that get 5-star reviews from past clients.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
        tag: "outreach"
    },
    {
        id: "gmb-checklist",
        title: "GMB Ranking Audit",
        description: "The exact 15-point checklist we use to rank plumbing & HVAC companies in the Map Pack.",
        image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=600",
        tag: "SEO"
    }
];

export function SearchDominance() {
    return (
        <div className="w-full h-full p-6 bg-zinc-900/50 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono text-zeniac-gold uppercase tracking-wider">
                        Free Resources
                    </span>
                    <div className="h-px w-8 bg-zinc-800" />
                </div>
                <h3 className="text-xl font-bold font-typewriter text-zinc-100 mb-2">
                    Dominance Templates
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Battle-tested systems you can swipe and deploy today.
                </p>
            </div>

            <div className="space-y-3">
                {templates.map((template, idx) => (
                    <Dialog key={template.id}>
                        <DialogTrigger asChild>
                            <button className="w-full group flex items-center gap-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all text-left px-2 rounded-md">
                                <div className="w-8 h-8 rounded bg-zinc-800 overflow-hidden shrink-0 relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-zeniac-gold/5 group-hover:bg-zeniac-gold/10 transition-colors" />
                                    <span className="text-[10px] font-mono text-zeniac-gold font-bold">0{idx + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-zinc-300 group-hover:text-zeniac-gold truncate transition-colors">
                                        {template.title}
                                    </h4>
                                    <p className="text-[9px] text-zinc-500 truncate uppercase tracking-tighter">
                                        {template.tag} — Strategic Asset
                                    </p>
                                </div>
                                <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full group-hover:border-zeniac-gold/30 group-hover:text-zeniac-gold transition-colors">
                                    DOWNLOAD
                                </span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-900">
                            <LeadForm
                                serviceId="resource-download"
                                resourceName={template.title}
                            />
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </div>
    );
}
