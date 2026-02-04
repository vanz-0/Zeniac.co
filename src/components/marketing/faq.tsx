"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "HOW QUICKLY WILL I SEE MEASURABLE RESULTS?",
        answer: "Technical optimizations (Speed, SEO Foundation) are immediate. For Local SEO and 'Dominance' rankings, most clients see significant movement within 30-60 days. We focus on 'Speed is Currency'—if we can't move the needle fast, we pivot the strategy."
    },
    {
        question: "WHAT IF I'VE TRIED MARKETING AGENCIES BEFORE AND FAILED?",
        answer: "Most agencies sell 'Activity' (posting, blogging). Zeniac sells 'Intelligence' and 'Systems'. We don't just post content; we engineer conversion funnels and reputation loops that work even when you aren't looking. We aren't an expense; we are your brand's Operating System."
    },
    {
        question: "DO YOU WORK WITH BUSINESSES IN MY SPECIFIC INDUSTRY?",
        answer: "We specialize in female-centric brands across Beauty, Wellness, Fashion, and Luxury Retail. However, our 'DOE' framework (Directives, Orchestration, Execution) is industry-agnostic. If you need to dominate a local market, our systems apply."
    },
    {
        question: "WHY IS YOUR PRICING HIGHER THAN BASIC SOCIAL MEDIA MANAGERS?",
        answer: "Because we aren't managers; we are engineers. A manager posts a photo. Zeniac builds a machine that captures leads, automates follow-ups, and protects your reputation. You are paying for a scalable system, not a monthly checklist."
    },
    {
        question: "CAN I CANCEL MY SUBSCRIPTION AT ANY TIME?",
        answer: "Yes. We believe in results-based retention. If the system isn't delivering the 'Dominance' we promised, you shouldn't be paying. No predatory long-term lock-ins—just high-performance partnership."
    }
];

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-transparent relative overflow-hidden" id="faq">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white mb-6 uppercase">
                        COMMON <span className="text-zeniac-gold">OBJECTIONS</span>
                    </h2>
                    <p className="text-muted-foreground font-mono text-lg italic">
                        Addressing the friction before we begin. Absolute transparency is the foundation of dominance.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={cn(
                                "border border-white/10 bg-zeniac-charcoal/30 backdrop-blur-sm transition-all duration-300",
                                activeIndex === index ? "border-zeniac-gold/50" : "hover:border-white/20"
                            )}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                            >
                                <span className={cn(
                                    "text-lg md:text-xl font-typewriter font-bold uppercase tracking-tight transition-colors",
                                    activeIndex === index ? "text-zeniac-gold" : "text-zeniac-white group-hover:text-zeniac-gold/80"
                                )}>
                                    {faq.question}
                                </span>
                                <div className="ml-4 flex-shrink-0">
                                    {activeIndex === index ? (
                                        <Minus className="w-6 h-6 text-zeniac-gold" />
                                    ) : (
                                        <Plus className="w-6 h-6 text-white/30 group-hover:text-zeniac-gold" />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 md:p-8 pt-0 border-t border-white/5 font-mono text-muted-foreground leading-relaxed italic">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zeniac-gold/5 blur-[150px] pointer-events-none" />
        </section>
    );
}
