"use client";
import { motion } from "framer-motion";


export function PreFooterCTA({ onOpenWizard }: { onOpenWizard: () => void }) {
    return (
        <section className="py-24 relative overflow-hidden bg-zeniac-black border-t border-white/5">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto bg-zeniac-charcoal/50 border border-white/10 p-8 md:p-12 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white uppercase leading-tight">
                                SECURE YOUR <span className="text-zeniac-gold">POSITION</span>
                            </h2>
                            <p className="text-muted-foreground font-mono text-lg">
                                Stop guessing. Get a <span className="text-zeniac-gold">Free Strategy Audit</span> of your business and discover exactly where you're losing money.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-zeniac-gold font-mono text-xs uppercase tracking-widest">
                                    <span className="w-2 h-2 bg-zeniac-gold rounded-full animate-pulse" />
                                    TRANSMISSION SECURE
                                </div>
                                <div className="flex items-center gap-3 text-zeniac-white/40 font-mono text-xs uppercase tracking-widest">
                                    <span className="w-2 h-2 bg-white/20 rounded-full" />
                                    ZERO PLACEHOLDER PROMISE
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-zeniac-gold/20 blur-xl rounded-none pointer-events-none" />
                            <div className="relative bg-black/40 border border-white/10 p-6 flex flex-col items-center text-center space-y-6">
                                <h3 className="text-sm font-mono text-zeniac-gold uppercase tracking-widest">Engagement Terminal</h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                    Initiate a deep-scan analysis of your digital footprint to identify critical revenue leaks.
                                </p>
                                <button
                                    onClick={onOpenWizard}
                                    className="w-full bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-typewriter font-black uppercase py-4 tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    INITIATE SYSTEM SCAN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Aesthetic */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zeniac-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-zeniac-gold/5 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
}
