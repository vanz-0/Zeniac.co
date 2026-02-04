"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

import projects from "@/data/portfolio.json";

export function Portfolio() {
    return (
        <section className="py-24 bg-zeniac-black relative" id="portfolio">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white mb-6 uppercase">
                            EVIDENCE OF <span className="text-zeniac-gold">DOMINANCE</span>
                        </h2>
                        <p className="text-muted-foreground font-mono text-lg italic">
                            We don't just promise results; we engineer them. Explore our recent strategic transformations.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-none border-white/10 text-white hover:border-zeniac-gold hover:text-zeniac-gold font-mono"
                        asChild
                    >
                        <a href="#" className="flex items-center gap-2">
                            VIEW FULL CASE STUDIES <ExternalLink className="w-4 h-4" />
                        </a>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group relative bg-zeniac-charcoal/30 border border-white/5 overflow-hidden hover:border-zeniac-gold/30 transition-all duration-300"
                        >
                            {/* Project Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zeniac-black via-transparent to-transparent" />
                                <div className="absolute top-4 right-4 bg-zeniac-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-zeniac-gold" />
                                    <span className="text-[10px] font-mono text-white tracking-widest uppercase">Verified Outcome</span>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-zeniac-gold text-[10px] font-mono uppercase tracking-[0.2em] mb-1">
                                            {project.category}
                                        </p>
                                        <h3 className="text-xl font-typewriter font-bold text-white">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-mono font-bold text-lg leading-tight">
                                            {project.result}
                                        </p>
                                        <p className="text-white/40 text-[9px] font-mono uppercase">Key Result</p>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground font-mono italic mb-6 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-mono px-2 py-1 bg-white/5 border border-white/10 text-white/60">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href="#"
                                    className="flex items-center gap-2 text-xs font-mono font-bold text-zeniac-gold group-hover:gap-3 transition-all duration-300"
                                >
                                    READ INTELLIGENCE BRIEF <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
