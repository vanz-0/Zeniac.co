"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface TimelineItem {
    id: number;
    title: string;
    date: string;
    content: string;
    category: string;
    icon: React.ElementType;
    relatedIds: number[];
    status: "completed" | "in-progress" | "pending";
    energy: number;
}

interface RadialOrbitalTimelineProps {
    timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
    timelineData,
}: RadialOrbitalTimelineProps) {
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
        {}
    );
    const [viewMode, setViewMode] = useState<"orbital">("orbital");
    const [autoRotate, setAutoRotate] = useState<boolean>(true);
    const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
    const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const logoSrc = mounted && theme === 'light' ? '/logo-for-light-mode.png' : '/logo-for-dark-mode.png';

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
            setExpandedItems({});
            setActiveNodeId(null);
            setPulseEffect({});
            setAutoRotate(true);
        }
    };

    const toggleItem = (id: number) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) {
                    newState[parseInt(key)] = false;
                }
            });

            newState[id] = !prev[id];

            if (!prev[id]) {
                setActiveNodeId(id);
                setAutoRotate(false);

                const relatedItems = getRelatedItems(id);
                const newPulseEffect: Record<number, boolean> = {};
                relatedItems.forEach((relId) => {
                    newPulseEffect[relId] = true;
                });
                setPulseEffect(newPulseEffect);

                centerViewOnNode(id);
            } else {
                setActiveNodeId(null);
                setAutoRotate(true);
                setPulseEffect({});
            }

            return newState;
        });
    };

    // Version 4: Ref-Based Animation Loop (Smooth + Interactive)
    const angleRef = useRef(0);
    const targetAngleRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = () => {
            if (viewMode === "orbital") {
                if (autoRotate) {
                    // Increment Angle
                    angleRef.current = (angleRef.current + 0.05) % 360;
                    targetAngleRef.current = null; // Clear target when back to auto
                } else if (targetAngleRef.current !== null) {
                    // Smooth Transition to Target Angle
                    const diff = targetAngleRef.current - angleRef.current;
                    if (Math.abs(diff) > 0.1) {
                        angleRef.current += diff * 0.1; // Smooth LERP (10% per frame)
                    } else {
                        angleRef.current = targetAngleRef.current;
                    }
                }

                if (containerRef.current) {
                    containerRef.current.style.setProperty('--rotation', `${angleRef.current}deg`);
                }
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [autoRotate, viewMode]);


    const centerViewOnNode = (nodeId: number) => {
        setAutoRotate(false);
        const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
        const totalNodes = timelineData.length;

        // Current Angle + NodeAngle = TargetAngle (270)
        // Angle = 270 - NodeAngle
        const nodeAngle = (nodeIndex / totalNodes) * 360;
        let targetAngle = 270 - nodeAngle;

        // Update Target Angle Ref
        targetAngleRef.current = targetAngle;

        // The animation loop will now lerp to this targetAngle

        // Ref loop loop removed
        /*
        Object.values(nodeRefs.current).forEach((node) => { ... });
        */
    };

    const calculateNodePosition = (index: number, total: number) => {
        // Static Angle for Initial Placement
        const angle = (index / total) * 360;
        const radius = 280; // Increased radius
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian) + centerOffset.x;
        const y = radius * Math.sin(radian) + centerOffset.y;

        const zIndex = 100;
        const opacity = 1;

        return { x, y, angle, zIndex, opacity };
    };

    const getRelatedItems = (itemId: number): number[] => {
        const currentItem = timelineData.find((item) => item.id === itemId);
        return currentItem ? currentItem.relatedIds : [];
    };

    const isRelatedToActive = (itemId: number): boolean => {
        if (!activeNodeId) return false;
        const relatedItems = getRelatedItems(activeNodeId);
        return relatedItems.includes(itemId);
    };

    const getStatusStyles = (status: TimelineItem["status"]): string => {
        switch (status) {
            case "completed":
                return "text-zeniac-black bg-zeniac-gold border-zeniac-gold";
            case "in-progress":
                return "text-zeniac-white bg-transparent border-zeniac-gold animate-pulse";
            case "pending":
                return "text-zeniac-white bg-zeniac-black/40 border-white/20";
            default:
                return "text-zeniac-white bg-zeniac-black/40 border-white/20";
        }
    };

    return (
        <div
            className="w-full min-h-[800px] flex flex-col items-center justify-center bg-zeniac-black relative overflow-hidden"
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_70%)]" />

            <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center perspective-1000 scale-[0.45] sm:scale-[0.7] md:scale-100 origin-center transition-transform duration-500">
                <div
                    className="absolute w-full h-full flex items-center justify-center transition-all duration-1000"
                    style={{
                        transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
                    }}
                >
                    {/* Static Logo - Outside Rotation */}
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-zeniac-gold/80 to-yellow-600/80 animate-pulse flex items-center justify-center z-10 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
                        <div className="absolute w-32 h-32 rounded-full border border-zeniac-gold/20 animate-ping opacity-70"></div>
                        <div
                            className="absolute w-40 h-40 rounded-full border border-zeniac-gold/10 animate-ping opacity-50"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div className="w-20 h-20 flex items-center justify-center z-20">
                            <img
                                src={logoSrc}
                                alt="Zeniac"
                                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] p-2"
                            />
                        </div>
                    </div>

                    {/* Rotation Wrapper - Managed by JS Ref Animation */}
                    {/* Rotation Wrapper - CSS Variable Driven */}
                    <div
                        ref={orbitRef}
                        className="absolute w-full h-full flex items-center justify-center"
                        style={{
                            transform: 'rotate(var(--rotation, 0deg))',
                            willChange: 'transform'
                        } as React.CSSProperties}
                    >

                        <div className={`absolute w-[480px] h-[480px] rounded-full border border-black/5 dark:border-white/5 border-dashed ${autoRotate ? 'animate-spin-slow' : ''}`} style={{ animationDuration: "60s" }}></div>
                        <div className="absolute w-[600px] h-[600px] rounded-full border border-black/5 dark:border-white/5 opacity-30"></div>

                        {timelineData.map((item, index) => {
                            const position = calculateNodePosition(index, timelineData.length);
                            const isExpanded = expandedItems[item.id];
                            const isRelated = isRelatedToActive(item.id);
                            const isPulsing = pulseEffect[item.id];
                            const Icon = item.icon;

                            // Dynamic Z-Index: Active Node (ID) must be highest.
                            const isTheActiveNode = activeNodeId === item.id;
                            const finalZIndex = isTheActiveNode ? 500 : (isExpanded ? 200 : position.zIndex);

                            const nodeStyle = {
                                transform: `translate(${position.x}px, ${position.y}px) rotate(calc(var(--rotation, 0deg) * -1))`,
                                zIndex: finalZIndex,
                                opacity: isExpanded ? 1 : position.opacity,
                            };

                            return (
                                <div
                                    key={item.id}
                                    className="absolute cursor-pointer transition-opacity duration-700"
                                    style={nodeStyle}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleItem(item.id);
                                    }}
                                >
                                    {/* Counter-Rotate Wrapper to keep content upright */}
                                    {/* Content Wrapper - no ref needed for counter-rotate anymore */}
                                    <div className="relative">
                                        {/* Energy Field */}
                                        <div
                                            className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""
                                                }`}
                                            style={{
                                                background: `radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0) 70%)`,
                                                width: `${item.energy * 0.5 + 50}px`,
                                                height: `${item.energy * 0.5 + 50}px`,
                                                left: `-${(item.energy * 0.5 + 50 - 50) / 2}px`,
                                                top: `-${(item.energy * 0.5 + 50 - 50) / 2}px`,
                                            }}
                                        ></div>

                                        {/* Node Icon */}
                                        <div
                                            className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${isExpanded
                                                    ? "bg-zeniac-gold text-zeniac-black"
                                                    : isRelated
                                                        ? "bg-zeniac-gold/50 text-white"
                                                        : "bg-zeniac-charcoal text-zeniac-gold"
                                                }
                  border-2 
                  ${isExpanded
                                                    ? "border-zeniac-gold shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                                                    : isRelated
                                                        ? "border-zeniac-gold animate-pulse"
                                                        : "border-black/10 dark:border-white/10"
                                                }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-125" : "hover:scale-110 hover:border-zeniac-gold/50"}
                `}
                                        >
                                            <Icon size={24} />
                                        </div>

                                        {/* Label */}
                                        <div
                                            className={`
                  absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-xs font-mono font-bold tracking-wider
                  transition-all duration-300 bg-white/50 dark:bg-black/50 backdrop-blur-md px-2 py-1 border border-black/10 dark:border-white/10 rounded
                  ${isExpanded ? "text-zeniac-gold scale-110" : "text-black/80 dark:text-white/60"}
                `}
                                        >
                                            {item.title}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div> {/* End Rotation Wrapper */}

                    {/* CENTRAL ACTIVE CARD (Blocks Logo) */}
                    {activeNodeId !== null && (() => {
                        const item = timelineData.find(i => i.id === activeNodeId);
                        if (!item) return null;
                        return (
                            <div
                                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                            >
                                <div className="pointer-events-auto">
                                    <Card
                                        className="w-[280px] sm:w-[320px] rounded-none border border-black/10 dark:border-white/10 bg-white/95 dark:bg-zeniac-charcoal/80 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.4)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300 relative overflow-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Texture from BentoGrid */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_1px,transparent_1px)] bg-[length:4px_4px] pointer-events-none" />
                                        <CardHeader className="pb-4 border-b border-white/10 text-center relative z-10 pt-4">
                                            <button
                                                className="absolute top-2 right-2 text-white/50 hover:text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedItems({});
                                                    setActiveNodeId(null);
                                                    setAutoRotate(true);
                                                    setPulseEffect({});
                                                }}
                                            >
                                                ✕
                                            </button>
                                            <div className="flex justify-center items-center mb-2">
                                                <Badge
                                                    className={`px-3 py-1 text-xs font-mono rounded-md ${getStatusStyles(item.status)}`}
                                                >
                                                    {item.status.toUpperCase().replace("-", " ")}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-2xl md:text-3xl text-zeniac-black dark:text-zeniac-white font-mono tracking-tight">
                                                {item.title}
                                            </CardTitle>
                                            <span className="text-xs font-mono text-zeniac-gold tracking-widest uppercase block mt-1">
                                                {item.date}
                                            </span>
                                        </CardHeader>
                                        <CardContent className="pt-6 text-center">
                                            <p className="leading-relaxed mb-6 text-black/80 dark:text-gray-300 text-sm md:text-base font-medium">
                                                {item.content}
                                            </p>

                                            <div className="pt-4 border-t border-white/10">
                                                <div className="flex justify-between items-center text-xs mb-2 text-zeniac-gold/80 font-mono">
                                                    <span className="flex items-center">
                                                        <Zap size={14} className="mr-2" />
                                                        IMPACT
                                                    </span>
                                                    <span className="font-bold">{item.energy}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-yellow-700 to-zeniac-gold"
                                                        style={{ width: `${item.energy}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {item.relatedIds.length > 0 && (
                                                <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
                                                    <div className="flex items-center justify-center mb-3">
                                                        <Link size={12} className="text-black/50 dark:text-white/50 mr-2" />
                                                        <h4 className="text-[10px] uppercase tracking-wider font-bold text-black/50 dark:text-white/50">
                                                            Linked Modules
                                                        </h4>
                                                    </div>
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        {item.relatedIds.map((relatedId) => {
                                                            const relatedItem = timelineData.find(
                                                                (i) => i.id === relatedId
                                                            );
                                                            return (
                                                                <Button
                                                                    key={relatedId}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 px-3 text-[10px] rounded-md border-white/10 bg-white/5 hover:bg-zeniac-gold/10 hover:text-zeniac-gold hover:border-zeniac-gold/30 transition-all font-mono"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleItem(relatedId);
                                                                    }}
                                                                >
                                                                    {relatedItem?.title}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
