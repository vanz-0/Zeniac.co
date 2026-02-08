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

export function SocialProof() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zeniac-gold/30 to-transparent" />

            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl font-typewriter font-black text-zeniac-white mb-4">
                    TRUSTED BY <span className="text-zeniac-gold">VISIONARIES</span>
                </h2>
                <p className="text-muted-foreground font-mono max-w-xl mx-auto">
                    Global brands powering their digital dominance with Zeniac.
                </p>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 items-center">
                <div className="max-w-4xl mx-auto w-full">
                    <IconCloud iconSlugs={iconSlugs} />
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zeniac-gold/30 to-transparent" />
        </section>
    );
}
