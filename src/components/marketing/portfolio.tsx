"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "@/components/marketing/lead-form";
import portfolioData from "@/data/portfolio.json";

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
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs font-mono text-zeniac-gold tracking-wider uppercase">
                        {item.folder}
                    </span>
                </div>
            )}
        </motion.div>
    );
}

function ProjectCard({ project, index }: { project: PortfolioItem, index: number }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault(); // Prevent modal opening
        if (project.carousel) {
            setCurrentSlide((prev) => (prev + 1) % project.carousel!.length);
        }
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault(); // Prevent modal opening
        if (project.carousel) {
            setCurrentSlide((prev) => (prev - 1 + project.carousel!.length) % project.carousel!.length);
        }
    };

    const isTestimonial = project.category === "Clients' Businesses Testimonials";
    const currentItem = project.carousel ? project.carousel[currentSlide] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-zeniac-gold/30 transition-all duration-500 ${isTestimonial ? "md:col-span-2 lg:col-span-3" : ""
                }`}
        >
            {/* Visual Header */}
            <div className={`relative ${isTestimonial ? "h-96" : "h-64"} overflow-hidden bg-zinc-950`}>

                {/* Before/After Logic - Explicit Comparison Grid */}
                {project.before_after && project.before_after.length >= 2 ? (
                    <div className="relative w-full h-full flex">
                        {/* BEFORE Image (Left) */}
                        <div className="w-1/2 h-full relative border-r border-white/10 group/before">
                            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                                <span className="text-xs font-mono text-zinc-400">BEFORE</span>
                            </div>
                            <img
                                src={project.before_after[0]}
                                alt="Before"
                                className="w-full h-full object-cover grayscale group-hover/before:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        {/* AFTER Image (Right) */}
                        <div className="w-1/2 h-full relative group/after">
                            <div className="absolute top-4 right-4 z-20 bg-zeniac-gold/20 backdrop-blur-sm px-2 py-1 rounded border border-zeniac-gold/30">
                                <span className="text-xs font-mono text-zeniac-gold font-bold">AFTER</span>
                            </div>
                            <img
                                src={project.before_after[1]}
                                alt="After"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Center Divider/Icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-xl">
                                <ExternalLink className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                ) : project.carousel ? (
                    // Carousel Logic (Ads, Templates, Deliverables, Testimonials)
                    <div className="w-full h-full relative group/carousel">
                        <div className="w-full h-full relative">
                            {project.carousel.map((item, idx) => (
                                <CarouselItem key={idx} item={item} isActive={idx === currentSlide} />
                            ))}
                        </div>

                        {/* Navigation Arrows - Ensured pointer events capture clicks */}
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

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                            {project.carousel.map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSlide ? 'bg-zeniac-gold w-3' : 'bg-white/20'}`} />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Fallback Single Image
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                )}

                {/* External Link for Non-Testimonials */}
                {!isTestimonial && <div className="absolute top-4 right-4 translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur border border-white/10 flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-zeniac-gold" />
                    </div>
                </div>}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
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

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
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
                    <div className="text-right">
                        <span className="block text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                            Result
                        </span>
                        <span className="text-sm font-bold text-zinc-300">
                            {project.result}
                        </span>
                    </div>
                </div>
            </div>

            {/* Click Action - Modal or Link */}
            {/* If it's a testimonial, we don't need a modal, the video play handles it or the image is just proof */}
            {!isTestimonial && (
                <div className="absolute inset-0 z-0">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="w-full h-full cursor-pointer outline-none"></button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-900">
                            <LeadForm
                                serviceId="portfolio-inquiry"
                                resourceName={project.title}
                            />
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
                <a href="https://drive.google.com/drive/folders/15azvnK4VvLTTXOmBez2Oe64uVVeMYL41?usp=sharing" target="_blank" rel="noopener noreferrer" className="block text-center mb-16 cursor-pointer group">
                    <h2 className="text-3xl md:text-4xl font-typewriter font-black text-zeniac-white mb-4 group-hover:text-zeniac-gold transition-colors">
                        EVIDENCE OF <span className="text-zeniac-gold group-hover:text-white transition-colors">DOMINANCE</span>
                    </h2>
                    <p className="text-muted-foreground font-mono max-w-2xl mx-auto group-hover:text-zinc-300 transition-colors">
                        Strategic operations and brand architecture that scales.
                    </p>
                </a>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioData.map((project, index) => (
                        // @ts-ignore - JSON data casting to strict type
                        <ProjectCard key={project.id || index} project={project as PortfolioItem} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
