"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Sparkles, Send, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Suggestion {
    id: string;
    title: string;
    description: string;
    category: string;
    votes: number;
    status: string;
}

const CATEGORIES = [
    { id: "branding", label: "Branding & Identity", icon: "🎨" },
    { id: "social-media", label: "Social Media Marketing", icon: "📱" },
    { id: "sales", label: "Sales & Closing", icon: "💰" },
    { id: "onboarding", label: "Client Onboarding", icon: "🤝" },
    { id: "nurturing", label: "Lead Nurturing", icon: "📧" },
    { id: "automation", label: "Automation & Systems", icon: "⚡" },
    { id: "seo", label: "SEO & Search", icon: "🔍" },
    { id: "content", label: "Content Creation", icon: "✍️" },
    { id: "analytics", label: "Analytics & Reporting", icon: "📊" },
    { id: "other", label: "Other", icon: "💡" },
];

export function TemplatePoll() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("social-media");
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetchSuggestions();
        // Load voted IDs from localStorage
        const stored = localStorage.getItem("zeniac_voted");
        if (stored) setVotedIds(new Set(JSON.parse(stored)));
    }, []);

    const fetchSuggestions = async () => {
        try {
            const res = await fetch("/api/forms/suggestions");
            const data = await res.json();
            if (data.success) setSuggestions(data.suggestions);
        } catch (e) {
            console.error("Failed to fetch suggestions:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id: string) => {
        if (votedIds.has(id)) return;

        // Optimistic update
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s));
        const newVoted = new Set(votedIds).add(id);
        setVotedIds(newVoted);
        localStorage.setItem("zeniac_voted", JSON.stringify([...newVoted]));

        try {
            await fetch("/api/forms/suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "vote", suggestionId: id, email: email || "anonymous" }),
            });
        } catch (e) {
            console.error("Vote failed:", e);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setSubmitting(true);

        try {
            const res = await fetch("/api/forms/suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, category, email }),
            });
            const data = await res.json();
            if (data.success) {
                setSuggestions(prev => [data.suggestion, ...prev]);
                setTitle("");
                setDescription("");
                setShowForm(false);
            }
        } catch (e) {
            console.error("Submit failed:", e);
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = filterCategory === "all"
        ? suggestions
        : suggestions.filter(s => s.category === filterCategory);

    const statusBadge = (status: string) => {
        const map: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: "bg-amber-500/10", text: "text-amber-400", label: "REQUESTED" },
            approved: { bg: "bg-blue-500/10", text: "text-blue-400", label: "IN QUEUE" },
            built: { bg: "bg-green-500/10", text: "text-green-400", label: "BUILT ✓" },
            rejected: { bg: "bg-red-500/10", text: "text-red-400", label: "DECLINED" },
        };
        const s = map[status] || map.pending;
        return (
            <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider", s.bg, s.text)}>
                {s.label}
            </span>
        );
    };

    return (
        <section className="py-16 relative" id="template-poll">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-zeniac-gold/10 border border-zeniac-gold/20 rounded-full px-4 py-1.5 mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-zeniac-gold" />
                        <span className="text-xs font-mono text-zeniac-gold uppercase tracking-widest">Community Driven</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-typewriter font-black text-white mb-2">
                        WHAT TEMPLATE DO YOU <span className="text-zeniac-gold">NEED NEXT?</span>
                    </h3>
                    <p className="text-sm text-zinc-400 font-mono max-w-lg mx-auto">
                        Vote on upcoming templates or suggest your own. We build what you need.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <button
                        onClick={() => setFilterCategory("all")}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-mono border transition-all",
                            filterCategory === "all"
                                ? "bg-zeniac-gold text-black border-zeniac-gold"
                                : "bg-white/5 text-zinc-400 border-white/10 hover:border-zeniac-gold/30"
                        )}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCategory(cat.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-mono border transition-all",
                                filterCategory === cat.id
                                    ? "bg-zeniac-gold text-black border-zeniac-gold"
                                    : "bg-white/5 text-zinc-400 border-white/10 hover:border-zeniac-gold/30"
                            )}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Suggestions List */}
                <div className="space-y-3 mb-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-zeniac-gold">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 font-mono text-sm">
                            No suggestions yet in this category. Be the first!
                        </div>
                    ) : (
                        filtered.map((s, i) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-zeniac-gold/20 transition-all group"
                            >
                                {/* Vote Button */}
                                <button
                                    onClick={() => handleVote(s.id)}
                                    disabled={votedIds.has(s.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-1 shrink-0 p-2 rounded-lg transition-all min-w-[50px]",
                                        votedIds.has(s.id)
                                            ? "bg-zeniac-gold/10 text-zeniac-gold cursor-default"
                                            : "bg-white/5 text-zinc-500 hover:bg-zeniac-gold/10 hover:text-zeniac-gold cursor-pointer"
                                    )}
                                >
                                    <ThumbsUp className={cn("w-4 h-4", votedIds.has(s.id) && "fill-zeniac-gold")} />
                                    <span className="text-xs font-mono font-bold">{s.votes}</span>
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-mono font-bold text-white text-sm truncate">{s.title}</span>
                                        {statusBadge(s.status)}
                                    </div>
                                    {s.description && (
                                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{s.description}</p>
                                    )}
                                </div>

                                {/* Category Badge */}
                                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider hidden md:block">
                                    {CATEGORIES.find(c => c.id === s.category)?.icon} {s.category}
                                </span>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Suggest Form Toggle */}
                <div className="text-center">
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        variant="outline"
                        className="border-zeniac-gold/30 text-zeniac-gold hover:bg-zeniac-gold hover:text-black font-mono font-bold"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Suggest a Template
                        <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", showForm && "rotate-180")} />
                    </Button>
                </div>

                {/* Suggest Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-6"
                        >
                            <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-4 max-w-lg mx-auto">
                                <div>
                                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">Template Name *</label>
                                    <Input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Client Proposal Template"
                                        className="bg-white/5 border-white/10 focus:border-zeniac-gold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">Description (optional)</label>
                                    <Input
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="What should this template help with?"
                                        className="bg-white/5 border-white/10 focus:border-zeniac-gold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">Category *</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-zinc-300 font-mono focus:border-zeniac-gold outline-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5 block">Your Email (optional, for updates)</label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="bg-white/5 border-white/10 focus:border-zeniac-gold"
                                    />
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!title.trim() || submitting}
                                    className="w-full bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-mono font-bold"
                                >
                                    {submitting ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><Send className="w-4 h-4 mr-2" /> Submit Suggestion</>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
