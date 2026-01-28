import {
    FacebookIcon,
    GithubIcon,
    Grid2X2Plus,
    InstagramIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon,
    Copyright
} from 'lucide-react';

import { useTheme } from "next-themes";
import * as React from "react";

export function MinimalFooter() {
    const year = new Date().getFullYear();
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted && theme === 'light' ? '/logo-for-dark-mode.png' : '/logo-for-light-mode.png';

    const company = [
        { title: 'About Zeniac', href: '#' },
        { title: 'Careers', href: '#' },
        { title: 'Brand Assets', href: '#' },
        { title: 'Privacy Policy', href: '#' },
        { title: 'Terms of Service', href: '#' },
    ];

    const resources = [
        { title: 'Intelligence Blog', href: '#' },
        { title: 'Case Studies', href: '#' },
        { title: 'Client Portal', href: '#' },
        { title: 'Community', href: '#' },
    ];

    const socialLinks = [
        { icon: <InstagramIcon className="size-4" />, link: 'https://instagram.com/zen_mrch_' },
        { icon: <TwitterIcon className="size-4" />, link: 'https://x.com/MerchZenith' },
        { icon: <LinkedinIcon className="size-4" />, link: 'https://linkedin.com/in/zenith-merch' },
        { icon: <FacebookIcon className="size-4" />, link: 'https://facebook.com/Zeniac' },
        { icon: <YoutubeIcon className="size-4" />, link: 'https://youtube.com/@MerchZenith' },
    ];

    return (
        <footer className="relative bg-zeniac-black border-t border-white/10 mt-24">
            <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
                        <a href="#" className="flex items-center gap-2 w-max">
                            <img src={logoSrc} alt="Zeniac Logo" className="h-8 w-auto" />
                            <span className="font-mono text-xl font-bold tracking-tighter text-zeniac-white">ZENIAC</span>
                        </a>
                        <p className="text-muted-foreground max-w-sm font-mono text-sm leading-relaxed">
                            The operating system for female-centric brands. We blend high-end aesthetics with deep strategic intelligence.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((item, i) => (
                                <a
                                    key={i}
                                    className="bg-white/5 hover:bg-zeniac-gold/20 hover:text-zeniac-gold border border-white/10 rounded-full p-2.5 transition-all text-white/70"
                                    target="_blank"
                                    href={item.link}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <span className="text-zeniac-gold mb-4 block font-mono font-bold text-sm tracking-widest">
                            RESOURCES
                        </span>
                        <div className="flex flex-col gap-2">
                            {resources.map(({ href, title }, i) => (
                                <a
                                    key={i}
                                    className="w-max text-sm md:text-base text-gray-400 hover:text-zeniac-gold duration-200 font-mono"
                                    href={href}
                                >
                                    {title}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <span className="text-zeniac-gold mb-4 block font-mono font-bold text-sm tracking-widest">COMPANY</span>
                        <div className="flex flex-col gap-2">
                            {company.map(({ href, title }, i) => (
                                <a
                                    key={i}
                                    className="w-max text-sm md:text-base text-gray-400 hover:text-zeniac-gold duration-200 font-mono"
                                    href={href}
                                >
                                    {title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs font-mono">
                        &copy; {year} Zeniac.Co. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-600 font-mono">
                        <span>DESIGNED BY ZENIAC INTELLIGENCE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
