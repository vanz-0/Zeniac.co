"use client";

import * as React from "react";
import {
    ArrowRight,
    Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
    { title: "SOLUTIONS", href: "#solutions" },
    { title: "PROCESS", href: "#process" },
    { title: "FAQ", href: "#faq" },
    { title: "CONTACT", href: "#contact" },
];

export function Navbar({ onOpenWizard, onOpenBooking }: { onOpenWizard?: () => void; onOpenBooking?: () => void }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted && theme === 'light' ? '/logo-for-light-mode.png' : '/logo-for-dark-mode.png';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zeniac-black/80 backdrop-blur-md">
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
                        variant="outline"
                        onClick={onOpenBooking}
                        className="rounded-none hidden md:inline-flex border-zeniac-gold text-zeniac-gold hover:bg-zeniac-gold hover:text-zeniac-black font-mono font-bold"
                    >
                        BOOK A CALL
                    </Button>
                    <Button
                        variant="default"
                        onClick={onOpenWizard}
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
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>
                                    Access all sections of our platform.
                                </SheetDescription>
                            </SheetHeader>
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
                                <Button
                                    onClick={onOpenBooking}
                                    className="cursor-pointer rounded-none border-zeniac-gold text-zeniac-gold hover:bg-zeniac-gold hover:text-zeniac-black font-mono w-full"
                                    variant="outline"
                                >
                                    BOOK A CALL
                                </Button>
                                <Button
                                    onClick={onOpenWizard}
                                    className="cursor-pointer rounded-none bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-mono w-full"
                                >
                                    START PROJECT <ArrowRight className="ml-1 w-4 h-4" />
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
