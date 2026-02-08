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
        { title: 'The Zeniac Vision', href: '#' },
        { title: 'Strategy & DOE', href: '#' },
        { title: 'Privacy Policy', href: '#' },
        { title: 'Terms of Service', href: '#' },
    ];

    const resources = [
        { title: 'Intelligence Blog', href: '#' },
        { title: 'Live Case Studies', href: '#' },
        { title: 'Client Briefings', href: '#' },
        { title: 'The 30-Day Plan', href: '#' },
    ];

    const contactLinks = [
        { title: 'hello@zeniac.co', href: 'mailto:hello@zeniac.co' },
        { title: '+254 724 898 620', href: 'tel:+254724898620' },
        { title: 'Nairobi, Kenya', href: '#' },
    ];

    const socialLinks = [
        { icon: <InstagramIcon className="size-4" />, link: 'https://instagram.com/zeniac.co' },
        { icon: <TwitterIcon className="size-4" />, link: 'https://x.com/ZeniacCo' },
        { icon: <LinkedinIcon className="size-4" />, link: 'https://www.linkedin.com/company/zeniac' },
        { icon: <FacebookIcon className="size-4" />, link: 'https://facebook.com/zeniac.co' },
        { icon: <YoutubeIcon className="size-4" />, link: 'https://youtube.com/@ZeniacCo' },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            ),
            link: 'https://tiktok.com/@zeniac.co'
        },
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
                            The operating system for high-growth small businesses. Primarily serving female-centric brands with high-end aesthetics and deep operational intelligence.
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

                    <div className="col-span-1 md:col-span-2">
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

                    <div className="col-span-1 md:col-span-2">
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

                    <div className="col-span-1 md:col-span-2">
                        <span className="text-zeniac-gold mb-4 block font-mono font-bold text-sm tracking-widest">CONTACT</span>
                        <div className="flex flex-col gap-2">
                            {contactLinks.map(({ href, title }, i) => (
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
