"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
    {
        name: "Case Studies Pending",
        role: "The Zeniac Standard",
        content: "We are currently finalizing our deep-dive case studies. At Zeniac, we don't just share quotes; we share data-backed transformations. Stay tuned for our next batch of dominance evidence.",
        rating: 5,
        location: "Nairobi, KE"
    }
];

export function Reviews() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden" id="reviews">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white mb-6 uppercase">
                        CLIENT <span className="text-zeniac-gold">VERDICTS</span>
                    </h2>
                    <p className="text-muted-foreground font-mono text-lg">
                        Evidence of market dominance across sectors. We don't just deliver content; we deliver results.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group p-8 border border-white/10 bg-zeniac-charcoal/30 backdrop-blur-sm relative",
                                "hover:border-zeniac-gold/50 transition-all duration-300"
                            )}
                        >
                            <div className="absolute top-6 right-8 text-white/5 group-hover:text-zeniac-gold/10 transition-colors">
                                <Quote className="w-16 h-16" />
                            </div>

                            <div className="flex gap-1 mb-6 text-zeniac-gold">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>

                            <p className="text-lg md:text-xl font-mono text-zeniac-white mb-8 relative z-10 italic leading-relaxed">
                                "{review.content}"
                            </p>

                            <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                <div>
                                    <h4 className="font-typewriter font-black text-zeniac-white uppercase tracking-tight">
                                        {review.name}
                                    </h4>
                                    <p className="text-xs font-mono text-muted-foreground uppercase py-1">
                                        {review.role}
                                    </p>
                                </div>
                                <span className="text-[10px] font-mono text-zeniac-gold/50 border border-zeniac-gold/20 px-2 py-1 rounded-none uppercase">
                                    {review.location}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Aesthetic elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] bg-zeniac-gold/5 blur-[120px] pointer-events-none" />
        </section>
    );
}
