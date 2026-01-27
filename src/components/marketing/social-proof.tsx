"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
    Cloud,
    fetchSimpleIcons,
    ICloud,
    renderSimpleIcon,
    SimpleIcon,
} from "react-icon-cloud";

// --- Icon Cloud Configuration ---

export const cloudProps: Omit<ICloud, "children"> = {
    containerProps: {
        style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingTop: 40,
        },
    },
    options: {
        reverse: true,
        depth: 1,
        wheelZoom: false,
        imageScale: 2,
        activeCursor: "default",
        tooltip: "native",
        initial: [0.1, -0.1],
        clickToFront: 500,
        tooltipDelay: 0,
        outlineColour: "#0000",
        maxSpeed: 0.03,
        minSpeed: 0.01,
    },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
    const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
    const fallbackHex = theme === "light" ? "#6e6e73" : "#FFD700"; // Gold fallback
    const minContrastRatio = theme === "dark" ? 2 : 1.2;
    return renderSimpleIcon({
        icon,
        bgHex,
        fallbackHex,
        minContrastRatio,
        size: 42,
        aProps: {
            href: undefined,
            target: undefined,
            rel: undefined,
            onClick: (e: any) => e.preventDefault(),
        },
    });
};

export type DynamicCloudProps = {
    iconSlugs: string[];
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

export function IconCloud({ iconSlugs }: DynamicCloudProps) {
    const [data, setData] = useState<IconData | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
    }, [iconSlugs]);

    const renderedIcons = useMemo(() => {
        if (!data) return null;
        return Object.values(data.simpleIcons).map((icon) =>
            renderCustomIcon(icon, theme || "dark")
        );
    }, [data, theme]);

    return (
        // @ts-ignore
        <Cloud {...cloudProps}>
            <>{renderedIcons}</>
        </Cloud>
    );
}

const iconSlugs = [
    "instagram", "facebook", "youtube", "tiktok", "pinterest", "shopify", "wordpress",
    "googleanalytics", "stripe", "react", "nextdotjs", "typescript", "javascript",
    "tailwindcss", "figma", "adobephotoshop", "adobepremierepro", "canva"
];


// --- Testimonials Configuration ---

type Testimonial = {
    quote: string;
    name: string;
    designation: string;
    src: string;
};

const testimonialsData: Testimonial[] = [
    {
        quote:
            "Zeniac transformed our boutique into a digital empire. The 'Front-Style' aesthetic is exactly what our premium clients expect.",
        name: "Elena V.",
        designation: "Founder, Aura Beauty",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
        quote:
            "The intelligence behind the design is palpable. Every interaction feels calculated for conversion.",
        name: "Sarah Jenkins",
        designation: "CMO, Luxe Wellness",
        src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
    },
    {
        quote:
            "Finally, a tech partner that understands the nuance of female-centric luxury markets. Fast, smart, and beautiful.",
        name: "Isabella Rossi",
        designation: "Director, Moda Milano",
        src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=3580&auto=format&fit=crop",
    },
];

export const AnimatedTestimonials = ({
    testimonials = testimonialsData,
    autoplay = false,
    className,
}: {
    testimonials?: Testimonial[];
    autoplay?: boolean;
    className?: string;
}) => {
    const [active, setActive] = useState(0);

    const handleNext = () => {
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const isActive = (index: number) => {
        return index === active;
    };

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay]);

    const randomRotateY = () => {
        return Math.floor(Math.random() * 21) - 10;
    };

    return (
        <div className={cn("max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-20", className)}>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
                <div>
                    <div className="relative h-80 w-full">
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.src}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: -100,
                                        rotate: randomRotateY(),
                                    }}
                                    animate={{
                                        opacity: isActive(index) ? 1 : 0.7,
                                        scale: isActive(index) ? 1 : 0.95,
                                        z: isActive(index) ? 0 : -100,
                                        rotate: isActive(index) ? 0 : randomRotateY(),
                                        zIndex: isActive(index)
                                            ? 999
                                            : testimonials.length + 2 - index,
                                        y: isActive(index) ? [0, -80, 0] : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 100,
                                        rotate: randomRotateY(),
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 origin-bottom"
                                >
                                    <Image
                                        src={testimonial.src}
                                        alt={testimonial.name}
                                        width={500}
                                        height={500}
                                        draggable={false}
                                        className="h-full w-full rounded-3xl object-cover object-center border border-white/10"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex justify-between flex-col py-4">
                    <motion.div
                        key={active}
                        initial={{
                            y: 20,
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        exit={{
                            y: -20,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                        }}
                    >
                        <h3 className="text-2xl font-bold font-mono text-zeniac-white">
                            {testimonials[active].name}
                        </h3>
                        <p className="text-sm text-zeniac-gold font-mono">
                            {testimonials[active].designation}
                        </p>
                        <motion.p className="text-lg text-gray-400 mt-8 font-mono leading-relaxed">
                            {testimonials[active].quote.split(" ").map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{
                                        filter: "blur(10px)",
                                        opacity: 0,
                                        y: 5,
                                    }}
                                    animate={{
                                        filter: "blur(0px)",
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut",
                                        delay: 0.02 * index,
                                    }}
                                    className="inline-block"
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </motion.p>
                    </motion.div>
                    <div className="flex gap-4 pt-12 md:pt-0">
                        <button
                            onClick={handlePrev}
                            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group/button hover:bg-zeniac-gold/20 hover:border-zeniac-gold/50 transition-all"
                        >
                            <IconArrowLeft className="h-5 w-5 text-zeniac-white group-hover/button:rotate-12 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group/button hover:bg-zeniac-gold/20 hover:border-zeniac-gold/50 transition-all"
                        >
                            <IconArrowRight className="h-5 w-5 text-zeniac-white group-hover/button:-rotate-12 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function SocialProof() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zeniac-gold/30 to-transparent" />

            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl font-mono font-bold text-zeniac-white mb-4">
                    TRUSTED BY <span className="text-zeniac-gold">VISIONARIES</span>
                </h2>
                <p className="text-muted-foreground font-mono max-w-xl mx-auto">
                    Global brands powering their digital dominance with Zeniac.
                </p>
            </div>

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <IconCloud iconSlugs={iconSlugs} />
                </div>
                <div className="order-1 lg:order-2">
                    <AnimatedTestimonials autoplay={true} />
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zeniac-gold/30 to-transparent" />
        </section>
    );
}
