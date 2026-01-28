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
    const [rotationAngle, setRotationAngle] = useState<number>(0);
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

    const [radius, setRadius] = useState(140);

    // Responsive Radius
    useEffect(() => {
        const updateRadius = () => {
            setRadius(window.innerWidth < 768 ? 140 : 240);
        };
        
        updateRadius();
        window.addEventListener('resize', updateRadius);
        return () => window.removeEventListener('resize', updateRadius);
    }, []);

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

                // centerViewOnNode(id); // Optional: disable auto-centering to keep context
            } else {
                setActiveNodeId(null);
                setAutoRotate(true);
                setPulseEffect({});
            }

            return newState;
        });
    };

    // Smooth Animation Loop
    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();

        const animate = (time: number) => {
            if (autoRotate && viewMode === "orbital") {
                const delta = time - lastTime;
                if (delta >= 16) { // Cap at ~60fps
                    setRotationAngle((prev) => (prev + 0.05 * (delta / 16)) % 360); // Smooth scaling
                    lastTime = time;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        if (autoRotate) {
             animationFrameId = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [autoRotate, viewMode]);

    const calculateNodePosition = (index: number, total: number) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian) + centerOffset.x;
        const y = radius * Math.sin(radian) + centerOffset.y;

        const zIndex = Math.round(100 + 50 * Math.cos(radian));
        const opacity = Math.max(
            0.4,
            Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
        );

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
            className="w-full min-h-[800px] flex flex-col items-center justify-center bg-transparent relative overflow-hidden"
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_70%)]" />

            <div className="relative w-full max-w-5xl h-[350px] md:h-[600px] flex items-center justify-center perspective-1000">
                <div
                    className="absolute w-full h-full flex items-center justify-center"
                    ref={orbitRef}
                    style={{
                        transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
                    }}
                >
                    {/* Central AI Core */}
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

                    {/* Mobile: 280px, Tablet: 480px, Desktop: 700px (Radius * 2) */}
                    <div className="absolute w-[280px] h-[280px] md:w-[480px] md:h-[480px] lg:w-[700px] lg:h-[700px] rounded-full border border-white/5 border-dashed animate-spin-slow" style={{ animationDuration: "60s" }}></div>
                    {/* Outer Ring */}
                    <div className="absolute w-[350px] h-[350px] md:w-[550px] md:h-[550px] lg:w-[850px] lg:h-[850px] rounded-full border border-white/5 opacity-30"></div>

                    {timelineData.map((item, index) => {
                        const position = calculateNodePosition(index, timelineData.length);
                        const isExpanded = expandedItems[item.id];
                        const isRelated = isRelatedToActive(item.id);
                        const isPulsing = pulseEffect[item.id];
                        const Icon = item.icon;

                        const nodeStyle = {
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            zIndex: isExpanded ? 200 : position.zIndex,
                            opacity: isExpanded ? 1 : position.opacity,
                        };

                        return (
                            <div
                                key={item.id}
                                ref={(el) => { nodeRefs.current[item.id] = el; }}
                                className="absolute transition-all duration-700 cursor-pointer"
                                style={nodeStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(item.id);
                                }}
                            >
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
                  w-12 h-12 rounded-full flex items-center justify-center
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
                                                : "border-white/10"
                                        }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-125" : "hover:scale-110 hover:border-zeniac-gold/50"}
                `}
                                >
                                    <Icon size={20} />
                                </div>

                                {/* Label */}
                                <div
                                    className={`
                  absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-xs font-mono font-bold tracking-wider
                  transition-all duration-300 bg-black/50 px-2 py-1 rounded
                  ${isExpanded ? "text-zeniac-gold scale-110" : "text-white/60"}
                `}
                                >
                                    {item.title}
                                </div>

                                {/* Expanded Card */}
                                {isExpanded && (
                                    <Card className="absolute top-24 left-1/2 -translate-x-1/2 w-72 bg-zeniac-black/95 backdrop-blur-xl border-zeniac-gold/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-zeniac-gold/50"></div>
                                        <CardHeader className="pb-2 border-b border-white/10">
                                            <div className="flex justify-between items-center">
                                                <Badge
                                                    className={`px-2 text-[10px] font-mono rounded-sm ${getStatusStyles(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status.toUpperCase().replace("-", " ")}
                                                </Badge>
                                                <span className="text-[10px] font-mono text-zeniac-gold/70">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl md:text-2xl mt-2 text-zeniac-white font-mono">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-base md:text-lg text-muted-foreground pt-4">
                                            <p className="leading-relaxed mb-4 text-zeniac-charcoal-foreground">{item.content}</p>

                                            <div className="pt-3 border-t border-white/10">
                                                <div className="flex justify-between items-center text-xs mb-1 text-zeniac-gold/80 font-mono">
                                                    <span className="flex items-center">
                                                        <Zap size={12} className="mr-1" />
                                                        IMPACT LEVEL
                                                    </span>
                                                    <span>{item.energy}%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-yellow-700 to-zeniac-gold"
                                                        style={{ width: `${item.energy}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {item.relatedIds.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-white/10">
                                                    <div className="flex items-center mb-2">
                                                        <Link size={12} className="text-white/50 mr-1" />
                                                        <h4 className="text-[10px] uppercase tracking-wider font-bold text-white/50">
                                                            Linked Modules
                                                        </h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.relatedIds.map((relatedId) => {
                                                            const relatedItem = timelineData.find(
                                                                (i) => i.id === relatedId
                                                            );
                                                            return (
                                                                <Button
                                                                    key={relatedId}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-6 px-2 text-[10px] rounded-sm border-white/10 bg-white/5 hover:bg-zeniac-gold/10 hover:text-zeniac-gold hover:border-zeniac-gold/30 transition-all font-mono"
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
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
