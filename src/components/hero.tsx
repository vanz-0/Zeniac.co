"use client";

import * as React from "react";
import {
    Activity,
    ArrowRight,
    BarChart,
    Code2,
    Menu,
    Sparkles,
    Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const navigationItems = [
    { title: "SERVICES", href: "#services" },
    { title: "PROCESS", href: "#process" },
    { title: "RESOURCES", href: "#" },
    { title: "ABOUT US", href: "#" },
];

const labels = [
    { icon: Sparkles, label: "Brand Strategy" },
    { icon: Code2, label: "Web Development" },
    { icon: Activity, label: "Growth Marketing" },
];

export function Hero() {
    const controls = useAnimation();
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    React.useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [controls, isInView]);

    const titleWords = [
        "REACH",
        "YOUR",
        "ZENITH",
    ];

    return (
        <div className="relative w-full overflow-hidden bg-background">
            <header className="absolute top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <a href="#" className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-mono text-xl font-bold tracking-tighter text-white">ZENIAC<span className="text-[#FFD700]">.CO</span></span>
                        </div>
                    </a>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                className="text-xs font-bold tracking-widest text-white/70 hover:text-[#FFD700] transition-colors"
                            >
                                {item.title}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Button
                            variant="default"
                            className="rounded-full hidden md:inline-flex bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold tracking-wide"
                        >
                            Start Project <ArrowRight className="ml-1 w-4 h-4" />
                        </Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-black border-white/10">
                                <nav className="flex flex-col gap-6 mt-6">
                                    {navigationItems.map((item) => (
                                        <a
                                            key={item.title}
                                            href={item.href}
                                            className="text-sm font-bold tracking-widest text-white hover:text-[#FFD700] transition-colors"
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                    <Button className="cursor-pointer rounded-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold">
                                        Start Project <ArrowRight className="ml-1 w-4 h-4" />
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main>
                <section className="container relative z-10 py-32 md:py-48">
                    <div className="flex flex-col items-center text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6 inline-flex items-center rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-1 text-sm text-[#FFD700]"
                        >
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            <span className="font-medium tracking-wide">The Smart Business Partner</span>
                        </motion.div>

                        <motion.h1
                            initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
                            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative mb-6 font-mono text-5xl font-bold sm:text-7xl md:text-8xl lg:text-9xl max-w-5xl mx-auto leading-none tracking-tighter"
                        >
                            {titleWords.map((text, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: index * 0.15,
                                        duration: 0.6
                                    }}
                                    className={`inline-block mx-2 ${index === 2 ? "text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#E5C100]" : "text-white"}`}
                                >
                                    {text}
                                </motion.span>
                            ))}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="mx-auto mt-4 max-w-2xl text-lg md:text-xl text-white/60 font-sans leading-relaxed"
                        >
                            We empower female-centric brands with intelligent strategies ("Brainiac")
                            to reach their highest peak of performance ("Zenith").
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="mt-12 flex flex-wrap justify-center gap-8"
                        >
                            {labels.map((feature, index) => (
                                <motion.div
                                    key={feature.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 1.2 + (index * 0.15),
                                        duration: 0.6,
                                    }}
                                    className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <feature.icon className="h-4 w-4 text-[#FFD700]" />
                                    <span className="text-sm font-medium tracking-wide text-white/80">{feature.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 1.8,
                                duration: 0.6,
                            }}
                            className="flex gap-4"
                        >
                            <Button
                                size="lg"
                                className="rounded-full mt-12 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold h-12 px-8"
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full mt-12 border-white/20 text-white hover:bg-white/10 font-medium h-12 px-8"
                            >
                                View Services
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
