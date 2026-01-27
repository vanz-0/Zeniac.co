"use client";

import * as React from "react";
import {
    Activity,
    ArrowRight,
    BarChart,
    Brain,
    Menu,
    Sparkles,
    Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { SparklesCore } from "@/components/ui/sparkles";

const navigationItems = [
    { title: "SOLUTIONS", href: "#solutions" },
    { title: "PROCESS", href: "#process" },
    { title: "RESULTS", href: "#results" },
    { title: "CONTACT", href: "#contact" },
];

const labels = [
    { icon: Sparkles, label: "Premium Aesthetics" },
    { icon: Brain, label: "Smart Strategy" },
    { icon: Activity, label: "High Performance" },
];

const features = [
    {
        icon: Sparkles,
        label: "Zenith Design",
        description: "Elevate your brand with our signature 'Front-Style' aesthetic—bold, deep encodings, and gold accents.",
    },
    {
        icon: Brain,
        label: "Brainiac Logic",
        description: "Data-driven marketing strategies tailored for female-centric businesses in Beauty, Wellness, and Fashion.",
    },
    {
        icon: Zap,
        label: "Rapid Deployment",
        description: "Launch your 'Operating System' website faster with our pre-configured, high-performance component library.",
    },
];

export function HeroAnimation() {
    const controls = useAnimation();
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    React.useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [controls, isInView]);

    const titleWords = [
        "SYSTEMS",
        "THAT",
        "SCALE",
        "FOR",
        "DOMINANCE",
    ];

    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted && theme === 'light' ? '/logo-for-light-mode.png' : '/logo-for-dark-mode.png';

    return (
        <div className="relative min-h-screen bg-transparent overflow-hidden">
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={70}
                    className="w-full h-full"
                    particleColor="#FFD700"
                />
            </div>

            <header className="relative z-50">
                <div className="container mx-auto px-4 flex h-20 items-center justify-between">
                    <a href="#" className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                            <img src={logoSrc} alt="Zeniac Logo" className="h-10 w-auto" />
                            <span className="font-mono text-xl font-bold tracking-tighter text-zeniac-white">ZENIAC</span>
                        </div>
                    </a>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                className="text-sm font-mono text-zeniac-white hover:text-zeniac-gold transition-colors"
                            >
                                {item.title}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Button
                            variant="default"
                            className="rounded-none hidden md:inline-flex bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-mono font-bold"
                        >
                            START PROJECT <ArrowRight className="ml-1 w-4 h-4" />
                        </Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-zeniac-white hover:text-zeniac-gold">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-zeniac-black border-l-zeniac-gold/20">
                                <nav className="flex flex-col gap-6 mt-12">
                                    {navigationItems.map((item) => (
                                        <a
                                            key={item.title}
                                            href={item.href}
                                            className="text-lg font-mono text-zeniac-white hover:text-zeniac-gold transition-colors"
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                    <Button className="cursor-pointer rounded-none bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-mono w-full">
                                        START PROJECT <ArrowRight className="ml-1 w-4 h-4" />
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                <section className="container mx-auto px-4 py-32 lg:py-48">
                    <div className="flex flex-col items-center text-center">
                        <motion.h1
                            initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
                            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative font-mono text-5xl font-bold sm:text-6xl md:text-8xl lg:text-9xl max-w-7xl mx-auto leading-tight text-zeniac-white tracking-tight"
                        >
                            {titleWords.map((text, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.1 * index,
                                        duration: 0.8,
                                        ease: "easeOut"
                                    }}
                                    className={`inline-block mx-2 md:mx-4 ${text === "SCALE" || text === "DOMINANCE" ? "text-zeniac-gold" : ""}`}
                                >
                                    {text}
                                </motion.span>
                            ))}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="mx-auto mt-12 max-w-3xl text-2xl md:text-3xl text-zeniac-white/90 font-mono leading-normal"
                        >
                            Elevating local businesses with high-end content creation and strategic digital improvements. We turn local presence into market dominance.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="mt-12 flex flex-wrap justify-center gap-6"
                        >
                            {labels.map((feature, index) => (
                                <motion.div
                                    key={feature.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 1.2 + (index * 0.15),
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 10
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm"
                                >
                                    <feature.icon className="h-5 w-5 text-zeniac-gold" />
                                    <span className="text-sm font-mono text-zeniac-white">{feature.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 1.5,
                                duration: 0.6,
                                type: "spring",
                                stiffness: 100,
                                damping: 10
                            }}
                        >
                            <Button
                                size="lg"
                                className="cursor-pointer rounded-none mt-12 bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-mono text-lg px-8 py-6"
                            >
                                TRANSFORM YOUR BUSINESS <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-24 border-t border-white/10" ref={ref}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.6,
                        }}
                        className="text-center text-4xl font-mono font-bold mb-16 text-zeniac-white"
                    >
                        The Zeniac Advantage
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.label}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.4 + (index * 0.2),
                                    duration: 0.6,
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 10
                                }}
                                className="flex flex-col items-center text-center p-8 bg-zeniac-charcoal/50 border border-white/5 hover:border-zeniac-gold/50 transition-colors duration-300"
                            >
                                <div className="mb-6 rounded-full bg-zeniac-gold/10 p-4">
                                    <feature.icon className="h-8 w-8 text-zeniac-gold" />
                                </div>
                                <h3 className="mb-4 text-xl font-mono font-bold text-zeniac-white">
                                    {feature.label}
                                </h3>
                                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
