"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, Play, ArrowRightLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "@/components/marketing/lead-form";
import portfolioData from "@/data/portfolio.json";
import { SearchDominance } from "@/components/marketing/search-dominance";
import { cn } from "@/lib/utils";

// Define a proper interface for our project items
interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    description: string;
    result: string;
    tags: string[];
    image: string;
    carousel?: CarouselItemType[];
    before_after?: string[];
    growth_metrics?: {
        label: string;
        value: string;
    };
}

interface CarouselItemType {
    path: string;
    type: "image" | "video";
    folder?: string;
    url?: string;
}

// Specific component for the Carousel items
function CarouselItem({ item, isActive }: { item: CarouselItemType, isActive: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 w-full h-full ${isActive ? 'z-10' : 'z-0'}`}
        >
            {item.type === 'video' ? (
                <div className="relative w-full h-full bg-black/5 flex items-center justify-center group cursor-pointer" onClick={() => item.url && window.open(item.url, '_blank')}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-zeniac-gold/20 border border-zeniac-gold/50 flex items-center justify-center backdrop-blur-md hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-zeniac-gold fill-zeniac-gold ml-1" />
                        </div>
                    </div>
                    {/* If we have a thumbnail in 'path', show it, otherwise show a placeholder or nothing */}
                    {item.path && !item.path.endsWith('.mp4') ? (
                        <img src={item.path} alt="Video Thumbnail" className="w-full h-full object-cover opacity-50" />
                    ) : (
                        <div className="text-zinc-500 font-mono text-sm">View Video</div>
                    )}
                </div>
            ) : (
                <img
                    src={item.path}
                    alt="Portfolio Item"
                    className="w-full h-full object-cover"
                />
            )}
            {/* Attribution for Deliverables/Templates if folder is present */}
            {item.folder && (
                <div
                    className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 z-30 cursor-pointer hover:bg-zeniac-gold hover:text-black transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (item.url) window.open(item.url, '_blank');
                    }}
                >
                    <span className="text-xs font-mono tracking-wider uppercase flex items-center gap-1.5">
                        {item.folder}
                        <ExternalLink className="w-3 h-3" />
                    </span>
                </div>
            )}
        </motion.div>
    );
}

function ProjectCard({ project, index }: { project: PortfolioItem, index: number }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [beforeAfterIndex, setBeforeAfterIndex] = useState(0); // 0 = Before, 1 = After

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (project.carousel) {
            setCurrentSlide((prev) => (prev + 1) % project.carousel!.length);
        }
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (project.carousel) {
            setCurrentSlide((prev) => (prev - 1 + project.carousel!.length) % project.carousel!.length);
        }
    };

    const toggleBeforeAfter = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setBeforeAfterIndex((prev) => (prev === 0 ? 1 : 0));
    };

    const isTestimonial = project.category === "Clients' Businesses Testimonials";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-zeniac-gold/30 transition-all duration-500 flex flex-col h-full`}
        >
            {/* Visual Header */}
            <div className={`relative ${isTestimonial ? "aspect-video" : "aspect-square md:aspect-[4/3]"} overflow-hidden bg-zinc-950 shrink-0`}>

                {/* Before/After Logic - Split Thumbnail View */}
                {project.before_after && project.before_after.length >= 2 ? (
                    <div className="relative w-full h-full flex flex-col group/ba select-none">
                        <div className="relative w-full h-1/2 border-b border-white/10 overflow-hidden">
                            <img
                                src={project.before_after[0]}
                                alt="Before"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-2 left-2 z-20">
                                <span className="bg-black/60 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold backdrop-blur-sm">
                                    BEFORE
                                </span>
                            </div>
                        </div>
                        <div className="relative w-full h-1/2 overflow-hidden">
                            <img
                                src={project.before_after[1]}
                                alt="After"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 z-20">
                                <span className="bg-zeniac-gold text-black px-1.5 py-0.5 rounded text-[8px] font-mono font-bold">
                                    AFTER
                                </span>
                            </div>
                        </div>

                        {/* Overlay Toggle Indicator */}
                        <div className="absolute bottom-2 right-2 z-20 bg-black/40 backdrop-blur border border-white/10 rounded-full p-1.5 text-white/70 opacity-0 group-hover/ba:opacity-100 transition-opacity">
                            <ArrowRightLeft className="w-3 h-3 rotate-90" />
                        </div>
                    </div>
                ) : project.carousel ? (
                    <div
                        className="w-full h-full relative group/carousel cursor-pointer"
                        onClick={nextSlide}
                    >
                        <div className="w-full h-full relative">
                            {project.carousel.map((item, idx) => (
                                <CarouselItem key={idx} item={item} isActive={idx === currentSlide} />
                            ))}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <button
                                onClick={prevSlide}
                                className="w-8 h-8 rounded-full bg-black/50 hover:bg-zeniac-gold/20 border border-white/10 hover:border-zeniac-gold/50 flex items-center justify-center transition-all pointer-events-auto cursor-pointer z-20"
                            >
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-8 h-8 rounded-full bg-black/50 hover:bg-zeniac-gold/20 border border-white/10 hover:border-zeniac-gold/50 flex items-center justify-center transition-all pointer-events-auto cursor-pointer z-20"
                            >
                                <ChevronRight className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                            {project.carousel.map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSlide ? 'bg-zeniac-gold w-3' : 'bg-white/20'}`} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                )}

                {/* Growth Metrics Overlay - Only if defined */}
                {project.growth_metrics && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-end justify-between z-10">
                        <div className="text-left">
                            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">{project.growth_metrics.label}</div>
                            <div className="text-xl font-black font-typewriter text-white">{project.growth_metrics.value}</div>
                        </div>
                    </div>
                )}


                {/* External Link for Non-Testimonials */}
                {!isTestimonial && <div className="absolute top-4 right-4 translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-30">
                    <div className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur border border-white/10 flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-zeniac-gold" />
                    </div>
                </div>}
            </div>

            {/* Content - Compacted for better laptop fit */}
            <div className="p-5 flex-1 flex flex-col bg-zinc-900/50">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-zeniac-gold uppercase tracking-wider">
                                {project.category}
                            </span>
                            <div className="h-px w-8 bg-zinc-800" />
                        </div>
                        <h3 className="text-xl font-bold font-typewriter text-zinc-100 group-hover:text-zeniac-gold transition-colors">
                            {project.title}
                        </h3>
                    </div>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag: string) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-zinc-950 rounded text-[10px] font-mono text-zinc-500 border border-white/5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    {/* Only show "Result" if we don't have the big growth metric overlay */}
                    {!project.growth_metrics && (
                        <div className="text-right">
                            <span className="block text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                                Result
                            </span>
                            <span className="text-sm font-bold text-zinc-300">
                                {project.result}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Click Action - Modal Logic */}
            {!isTestimonial && (
                <div className="absolute inset-0 z-0">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="w-full h-full cursor-pointer outline-none"></button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] bg-zinc-950 border-zinc-900 p-0 overflow-hidden">
                            {project.before_after && project.before_after.length >= 2 ? (
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold font-typewriter text-zeniac-gold mb-4 uppercase tracking-tighter">
                                        {project.title} — TRANSFORMATION
                                    </h3>
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group/modal-carousel">
                                        <div className="absolute inset-0">
                                            {project.before_after.map((src, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: beforeAfterIndex === idx ? 1 : 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute inset-0"
                                                >
                                                    <img src={src} className="w-full h-full object-contain" alt={idx === 0 ? "Before" : "After"} />
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md transition-colors",
                                                            idx === 0 ? "bg-black/60 border-white/10 text-zinc-400" : "bg-zeniac-gold text-black border-zeniac-gold"
                                                        )}>
                                                            {idx === 0 ? "BEFORE" : "AFTER"}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Navigation */}
                                        <div className="absolute inset-0 flex items-center justify-between px-4 z-30 pointer-events-none">
                                            <button
                                                onClick={toggleBeforeAfter}
                                                className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-zeniac-gold hover:text-black transition-all"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={toggleBeforeAfter}
                                                className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-zeniac-gold hover:text-black transition-all"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {/* Indicators */}
                                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-30">
                                            {[0, 1].map((idx) => (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        "w-2 h-2 rounded-full transition-all",
                                                        beforeAfterIndex === idx ? "bg-zeniac-gold w-6" : "bg-white/20"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-zinc-400 max-w-md">
                                            {project.description}. Strategic brand sovereignty audit and market positioning.
                                        </div>
                                        {project.growth_metrics && (
                                            <div className="bg-zinc-900 border border-white/5 rounded-lg px-4 py-2 text-center">
                                                <div className="text-[10px] text-zinc-500 uppercase font-mono">{project.growth_metrics.label}</div>
                                                <div className="text-lg font-bold text-zeniac-gold">{project.growth_metrics.value}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <LeadForm
                                        serviceId="portfolio-inquiry"
                                        resourceName={project.title}
                                    />
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </motion.div>
    );
}

export function Portfolio() {
    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden" id="portfolio">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* 1. Header is now full width */}
                <div className="text-center mb-16">
                    <a href="https://drive.google.com/drive/folders/15azvnK4VvLTTXOmBez2Oe64uVVeMYL41?usp=sharing" target="_blank" rel="noopener noreferrer" className="block group">
                        <h2 className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white mb-4 group-hover:text-zeniac-gold transition-colors">
                            EVIDENCE OF <span className="text-zeniac-gold group-hover:text-white transition-colors">DOMINANCE</span>
                        </h2>
                        <p className="text-muted-foreground font-mono text-sm max-w-sm mx-auto group-hover:text-zinc-300 transition-colors">
                            Strategic operations and brand architecture that scales.
                        </p>
                    </a>
                </div>

                {/* 2. Mobile: horizontal carousel. Desktop: symmetric 3x2 grid */}
                <div className="mobile-carousel md:grid md:grid-cols-3 gap-6">
                    {/* Item 1: Search Dominance */}
                    <div className="w-[85vw] md:w-auto bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden h-full min-h-[400px] flex flex-col relative">
                        <div className="absolute inset-0">
                            <SearchDominance />
                        </div>
                    </div>

                    {/* Item 2: Deliverables */}
                    <div className="w-[85vw] md:w-auto">
                        <ProjectCard project={portfolioData[0] as PortfolioItem} index={1} />
                    </div>

                    {/* Item 3: Templates */}
                    <div className="w-[85vw] md:w-auto">
                        <ProjectCard project={portfolioData[1] as PortfolioItem} index={2} />
                    </div>

                    {/* Item 4: Ads & Promotions */}
                    <div className="w-[85vw] md:w-auto">
                        <ProjectCard project={portfolioData[2] as PortfolioItem} index={3} />
                    </div>

                    {/* Item 5: Evidence of Impact */}
                    <div className="w-[85vw] md:w-auto">
                        <ProjectCard project={portfolioData[3] as PortfolioItem} index={4} />
                    </div>

                    {/* Item 6: Brand Transformation */}
                    <div className="w-[85vw] md:w-auto">
                        <ProjectCard project={portfolioData[4] as PortfolioItem} index={5} />
                    </div>
                </div>
            </div>
        </section >
    );
}
