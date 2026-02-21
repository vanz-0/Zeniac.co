"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ArrowRight, Check, ChevronRight, FileText, Loader2, Search, Trophy, Zap, Minimize2, ExternalLink } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { AuditPDF } from '@/components/reports/AuditPDF';
import { useWizard } from "@/context/wizard-context";
import { CountingNumber } from "../ui/counting-number";
import { useMediaQuery } from "@/hooks/use-media-query";

interface WizardProps {
    // open prop is now controlled by context, but we keep the interface for compatibility if needed, 
    // though ideally we remove props and use context entirely. 
    // For specific triggers like "onOpenBooking", we can keep them or move to context/global event.
    // We'll keep props for "external" actions like checking booking.
    // We'll keep props for "external" actions like checking booking.
    onOpenBooking?: (data: { name: string; email: string; website: string }) => void;
}

export function TransformationWizard({ onOpenBooking }: WizardProps) {
    const {
        isOpen,
        openWizard, // Not used here directly but avail
        closeWizard,
        minimizeWizard,
        step,
        setStep,
        formData,
        setFormData,
        analysisData,
        setAnalysisData,
        isMinimized
    } = useWizard();

    const [isSending, setIsSending] = React.useState(false);
    const [sendError, setSendError] = React.useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [generatingPdf, setGeneratingPdf] = React.useState(false);
    const [isForceRefreshing, setIsForceRefreshing] = React.useState(false);

    const [queueStatus, setQueueStatus] = React.useState<string | null>(null);
    const [isWaking, setIsWaking] = React.useState(true);
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Initial Warm-up
    React.useEffect(() => {
        if (isOpen) {
            const wakeUp = async () => {
                try {
                    await fetch('/api/wake');
                    // Add a small artificial delay to show the "Initializing" state comfortably
                    await new Promise(r => setTimeout(r, 1500));
                } catch (e) {
                    console.warn("Wake up failed", e);
                } finally {
                    setIsWaking(false);
                }
            };
            wakeUp();
        } else {
            setIsWaking(true); // Reset for next open
        }
    }, [isOpen]);

    // Inactivity Timeout Watchdog
    React.useEffect(() => {
        let watchdog: NodeJS.Timeout;

        const resetWatchdog = () => {
            if (watchdog) clearTimeout(watchdog);
            if (isOpen && step === "details" && !formData.name && !formData.website) {
                // Only timeout on details step if empty, to prevent abandoning.
                // Actually user wanted revert if "stalls". 
                // Let's set a global inactivity for the wizard if user hasn't typed in 2 mins.
            }
        };

        const handleActivity = () => {
            // simpler approach: just auto-close if on "details" for > 3 minutes?
            // Or strictly sticky to the user request: "Inactivity timeout"
        };

        if (isOpen && step !== "processing" && step !== "results") {
            // specific timeout for "details" step to avoid stalling overlay
            watchdog = setTimeout(() => {
                // If still on details after 3 minutes with no progress, close it
                if (step === "details") {
                    closeWizard();
                }
            }, 180000); // 3 minutes
        }

        return () => clearTimeout(watchdog);
    }, [isOpen, step, closeWizard, formData]);

    const performAnalysis = async (retryCount = 0, force = false) => {
        try {
            if (queueStatus) setQueueStatus("Retrying connection...");
            if (force) setIsForceRefreshing(true);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: formData.website || "zeniac.co",
                    name: formData.name,
                    email: formData.email,
                    force: force
                }),
            });

            const data = await response.json();

            if (response.status === 429 && retryCount < 5) {
                const waitTime = data.retryAfter || 5;
                setQueueStatus(`System busy. Queued for ${waitTime}s...`);
                setTimeout(() => performAnalysis(retryCount + 1), waitTime * 1000);
                return;
            }

            if (data.success) {
                setAnalysisData(data.data);
                setQueueStatus(null);
            } else {
                // If error but not 429, throw to catch block
                throw new Error(data.error || "Analysis failed");
            }

        } catch (error: any) {
            console.error("Analysis failed:", error);
            setQueueStatus(error.message || "Analysis failed");
            // Fallback data but keep the error visible
            setAnalysisData({
                score: 42,
                techStack: "Undetected",
                competitorGap: "High",
                hasSocialProof: false,
                hasClearCTA: false,
                businessType: "Unknown",
                services: [],
                inferredPainPoints: ["Analysis encountered an error", error.message || "Unknown Error"],
                location: "Unknown",
                debug: { error: error.message }
            } as any);
        } finally {
            setIsForceRefreshing(false);
        }
        // Only move to results if we actually got data or failed permanently (not queued)
        // But here we rely on state updates. 
        // If we are queued, we returned early, so this finally block WONT run for 429 return.
        // Wait, performAnalysis is async, so `return` exits the function execution instance.
        // Correct.
    }

    // Move to results only if analysisData is set (checked via effect or here)
    // Actually, the original code setStep("results") in finally block.
    // We should change that to only setStep if we are NOT queued.
    // Effect to move to results when analysisData is Ready

    React.useEffect(() => {
        if (analysisData && step === "processing") {
            // giving a small delay for animation to finish if needed, or just go
            setStep("results");
        }
    }, [analysisData, step, setStep]);

    // Trigger analysis when entering processing step
    // We use a ref to prevent double-firing if strict mode is on or re-renders happen
    const analysisTriggered = React.useRef(false);

    // Reset analysis trigger when restarting wizard
    React.useEffect(() => {
        if (step === "intro") {
            analysisTriggered.current = false;
        }
    }, [step]);

    React.useEffect(() => {
        if (step === "processing" && !analysisData && !analysisTriggered.current) {
            analysisTriggered.current = true;
            performAnalysis();
        }
    }, [step, analysisData]);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Timeout warning for long analysis
    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (step === "processing" && !analysisData) {
            timeout = setTimeout(() => {
                setQueueStatus("Analysis taking longer than usual... Finalizing deep scan.");
            }, 45000); // 45s warning
        }
        return () => clearTimeout(timeout);
    }, [step, analysisData]);

    // Generate PDF Preview when entering "preview" step
    React.useEffect(() => {
        const generatePreview = async () => {
            if (step === "preview" && analysisData && mounted && !previewUrl) {
                setGeneratingPdf(true);
                try {
                    const blob = await pdf(
                        <AuditPDF
                            analysis={analysisData}
                            website={formData.website}
                            name={formData.name}
                            email={formData.email}
                            reportDate={new Date().toLocaleDateString()}
                        />
                    ).toBlob();
                    const url = URL.createObjectURL(blob);
                    setPreviewUrl(url);
                } catch (e) {
                    console.error("PDF Generation failed:", e);
                } finally {
                    setGeneratingPdf(false);
                }
            }
        };

        generatePreview();
    }, [step, analysisData, mounted, previewUrl]);

    // ENTER KEY HANDLER
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isOpen) {
                if (document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                setTimeout(() => {
                    handleNext();
                }, 100);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, step, formData]);


    const handleNext = async () => {
        if (step === "intro") setStep("details");
        else if (step === "details") {
            setStep("processing");
        }
        else if (step === "results") {
            setStep("preview");
        }
        else if (step === "preview") {
            setStep("email");
        }
        else if (step === "email") {
            if (!formData.email.includes("@") || !formData.email.includes(".")) {
                setSendError("Please enter a valid email address");
                return;
            }

            setIsSending(true);
            setSendError(null);
            try {
                const response = await fetch('/api/send-audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, analysis: analysisData }),
                });

                const contentType = response.headers.get("content-type");
                let errorMessage = "Failed to send email";

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    if (!response.ok) {
                        errorMessage = data.error || errorMessage;
                        throw new Error(errorMessage);
                    }
                } else {
                    if (!response.ok) {
                        throw new Error(`Server Error (${response.status})`);
                    }
                }

                setStep("success");
            } catch (error) {
                console.error("Failed to send audit", error);
                setSendError(error instanceof Error ? error.message : "An unexpected error occurred");
            } finally {
                setIsSending(false);
            }
        }
        else if (step === "success") {
            closeWizard();
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // If scanning, minimize instead of close
            if (step === "processing") {
                minimizeWizard();
            } else {
                closeWizard();
            }
        } else {
            // Opening is handled by context usually, but if dialog triggers it:
            // openWizard(); // This creates a loop if not careful with Dialog's onOpenChange
            // Dialog `onOpenChange` is usually called when clicking outside or ESC.
            // If `open` is false (closing), we logic above.
            // If `open` is true, we are already open.
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[700px] w-full sm:w-[95vw] h-full sm:h-auto sm:max-h-[95vh] bg-zeniac-black border-none sm:border-white/10 text-white backdrop-blur-xl p-0 overflow-y-auto overflow-x-hidden flex flex-col z-[100] focus:outline-none scrollbar-hide">
                <DialogTitle className="sr-only">Zeniac Transformation Wizard</DialogTitle>
                <DialogDescription className="sr-only">
                    Interactive questionnaire to analyze your digital presence.
                </DialogDescription>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-zeniac-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        initial={{ width: "0%" }}
                        animate={{
                            width: analysisData ? "100%" :
                                step === "intro" ? "5%" :
                                    step === "details" ? "15%" :
                                        step === "processing" ? "90%" :
                                            step === "results" ? "95%" :
                                                step === "preview" ? "98%" : "100%"
                        }}
                        transition={{
                            duration: analysisData ? 1 : (step === "processing" ? 90 : 0.8),
                            ease: analysisData ? "easeOut" : (step === "processing" ? "linear" : "easeOut")
                        }}
                    />
                </div>

                {/* Minimize Button (Top Right, explicit) */}
                {step === "processing" && (
                    <button
                        onClick={() => minimizeWizard()}
                        className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                        title="Minimize Scan"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                )}

                {/* Loading State Overlay */}
                {isOpen && isWaking && step === "intro" && (
                    <div className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4 text-center">
                        <Loader2 className="w-12 h-12 text-zeniac-gold animate-spin mb-4" />
                        <h3 className="text-xl font-mono text-white font-bold">Initializing Engine...</h3>
                        <p className="text-sm text-gray-500 mt-2">Connecting to secure analysis nodes.</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === "intro" && (
                        <StepContainer key="intro">
                            <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto pt-6">
                                <div className="p-4 rounded-full bg-zeniac-gold/10 border border-zeniac-gold/20 mb-2">
                                    <Trophy className="w-10 h-10 text-zeniac-gold" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-typewriter font-bold">
                                    Unlock Your <span className="text-zeniac-gold">Dominance</span>
                                </h2>
                                <p className="text-gray-400">
                                    Start your journey with a free comprehensive digital footprint analysis. See exactly where you stand and how to win.
                                </p>
                                <Button
                                    onClick={handleNext}
                                    size="lg"
                                    className="bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold px-8 mt-4 group"
                                >
                                    Start Assessment <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </StepContainer>
                    )}

                    {step === "details" && (
                        <StepContainer key="details">
                            <WizardHeader
                                title="The Basics"
                                subtitle="Let's identify your digital presence."
                            />
                            <div className="space-y-6 mt-8 max-w-md mx-auto w-full">
                                <div className="space-y-2">
                                    <Label>Company / Brand Name</Label>
                                    <Input
                                        className="bg-white/5 border-white/10 focus:border-zeniac-gold text-lg py-6"
                                        placeholder="Acme Corp"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <Input
                                        className="bg-white/5 border-white/10 focus:border-zeniac-gold text-lg py-6"
                                        placeholder="zeniac.co"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={handleNext}
                                        className="bg-white/10 hover:bg-white/20 text-white"
                                        disabled={!formData.name}
                                    >
                                        Start Deep Scan <Zap className="ml-2 w-4 h-4 fill-white" />
                                    </Button>
                                </div>
                            </div>
                        </StepContainer>
                    )}

                    {step === "processing" && (
                        <StepContainer key="processing">
                            <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-2 py-2 px-4 overflow-visible">
                                <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 bg-zeniac-gold/20 blur-xl rounded-full" />
                                    <svg
                                        viewBox="0 0 128 128"
                                        className="w-32 h-32 sm:w-40 sm:h-40 transform -rotate-90 relative z-10 overflow-visible"
                                    >
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            className="stroke-gray-800"
                                            strokeWidth="8"
                                            fill="transparent"
                                        />
                                        <motion.circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            className="stroke-zeniac-gold"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray="351.86"
                                            initial={{ strokeDashoffset: 351.86 }}
                                            animate={{ strokeDashoffset: analysisData ? 0 : 35 }}
                                            transition={{
                                                duration: analysisData ? 1.5 : 90,
                                                ease: analysisData ? "easeOut" : "linear"
                                            }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
                                        <motion.span
                                            className="text-3xl sm:text-4xl font-bold font-mono text-white"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <CountingNumber value={analysisData?.score || 42} />%
                                        </motion.span>
                                        <span className="text-xs text-gray-400 mt-1">OPTIMIZED</span>
                                    </div>
                                </div>
                                <div className="space-y-3 max-w-md">
                                    <h3 className="text-xl sm:text-2xl font-mono font-bold text-white">
                                        Analyzing <span className="text-zeniac-gold">{formData.website || "System"}</span>...
                                    </h3>
                                    <p className={`text-xs font-mono mb-2 uppercase tracking-widest ${queueStatus ? 'text-amber-400 animate-pulse' : 'text-zeniac-gray animate-pulse'}`}>
                                        {queueStatus || "Deep Scan in Progress - Estimated time: 60s"}
                                    </p>
                                    <p className="text-[10px] text-gray-500">You can minimize this window. Scan will continue.</p>
                                    <ProcessingSteps />
                                </div>
                            </div>
                        </StepContainer>
                    )}

                    {step === "results" && (
                        <StepContainer key="results">
                            <div className="flex justify-between items-center w-full">
                                <WizardHeader
                                    title="Intelligence Report"
                                    subtitle="Analysis complete. Critical gaps detected."
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => performAnalysis(0, true)}
                                    disabled={isForceRefreshing}
                                    className="text-zeniac-gold hover:bg-zeniac-gold/10 gap-2"
                                >
                                    {isForceRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                    FORCE RE-SCAN
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-50">
                                        <Activity className="w-4 h-4 text-zeniac-gold" />
                                    </div>
                                    <div className="text-5xl font-mono font-bold text-red-500 mb-2">{analysisData?.score || 0}<span className="text-xl text-gray-500">/100</span></div>
                                    <div className="text-xs uppercase tracking-widest text-gray-400">Digital Health Score</div>
                                    <div className="mt-4 text-xs text-red-300 bg-red-900/20 px-3 py-1 rounded-full">
                                        Tech Stack: {analysisData?.techStack || "Unknown"}
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Competitor Landscape</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-300">You</span>
                                            <div className="w-24 h-2 bg-red-500/30 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500" style={{ width: `${(analysisData?.score || 42) * 0.8}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-300">Rival A</span>
                                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-gray-400 w-[78%]" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-300">Rival B</span>
                                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-zeniac-gold w-[91%]" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4 italic">
                                        "Competitors are currently capturing {analysisData?.competitorGap || "high"} search traffic."
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
                                <h5 className="text-white font-bold text-sm mb-2">Identify Business Profile</h5>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Type</span>
                                        <p className="text-gray-300">{analysisData?.businessType || "Scanning..."}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Location</span>
                                        <p className="text-gray-300">{analysisData?.location || "Global/Unknown"}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-500 text-xs uppercase">Core Services</span>
                                        <p className="text-gray-300">{analysisData?.services?.join(", ") || "Detecting..."}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zeniac-gold/5 border border-zeniac-gold/10 rounded-lg p-4 mt-6">
                                <h5 className="text-zeniac-gold font-bold text-sm mb-2 flex items-center">
                                    <Search className="w-4 h-4 mr-2" /> Auto-Detected Friction Points
                                </h5>
                                <ul className="space-y-2">
                                    {analysisData?.inferredPainPoints?.map((point: string, i: number) => (
                                        <li key={i} className="text-xs md:text-sm text-gray-300 flex items-start">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                    {(!analysisData?.inferredPainPoints || analysisData.inferredPainPoints.length === 0) && (
                                        <li className="text-xs md:text-sm text-gray-300">Analysis in progress...</li>
                                    )}
                                </ul>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => closeWizard()}
                                    className="flex-1 border-white/10 hover:bg-white/5 text-gray-400 order-2 sm:order-1"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="flex-[2] bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold order-1 sm:order-2"
                                >
                                    Preview Full Report
                                </Button>
                            </div>
                        </StepContainer>
                    )}

                    {step === "preview" && (
                        <StepContainer key="preview">
                            <WizardHeader
                                title="Report Preview"
                                subtitle="Review your strategic roadmap before downloading."
                            />
                            <div className="mt-4 border border-white/10 rounded-lg p-1 bg-white/5 h-[300px] md:h-[450px] overflow-hidden relative group flex items-center justify-center">
                                {generatingPdf ? (
                                    <div className="flex flex-col items-center justify-center h-full text-zeniac-gold animate-pulse gap-6">
                                        <Loader2 className="w-16 h-16 animate-spin" />
                                        <div className="text-center space-y-2">
                                            <div className="text-xl font-mono uppercase tracking-widest font-bold">Generating Report</div>
                                            <p className="text-sm text-gray-400">Compiling 18-page strategic analysis...</p>
                                        </div>
                                    </div>
                                ) : previewUrl ? (
                                    <div className="w-full h-full relative">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center h-full gap-6 p-8 text-center bg-gradient-to-b from-black/60 to-black/90">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full bg-zeniac-gold/10 flex items-center justify-center border border-zeniac-gold/20">
                                                    <FileText className="w-12 h-12 text-zeniac-gold animate-bounce" />
                                                </div>
                                                <div className="absolute -top-2 -right-2 bg-zeniac-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
                                                    READY
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Intelligence Report</h4>
                                                <p className="text-sm text-zeniac-gray font-mono">18-Page Comprehensive Analysis Generated</p>
                                            </div>
                                            <div className="w-full h-px bg-gradient-to-r from-transparent via-zeniac-gold/30 to-transparent" />
                                            <div className="space-y-4 w-full">
                                                <Button
                                                    onClick={() => {
                                                        if (isMobile) {
                                                            const a = document.createElement("a");
                                                            a.href = previewUrl;
                                                            a.download = `Zeniac_Intelligence_Report_${formData.website.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            document.body.removeChild(a);
                                                        } else {
                                                            window.open(previewUrl, '_blank');
                                                        }
                                                    }}
                                                    className="w-full bg-zeniac-gold text-black hover:bg-white transition-all duration-300 font-mono font-bold py-6 text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] gap-2"
                                                >
                                                    TAP TO VIEW REPORT <ExternalLink className="w-4 h-4" />
                                                </Button>
                                                <p className="text-[10px] text-zeniac-gray/60 font-mono uppercase tracking-[0.2em]">
                                                    Optimized for full-screen viewing
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-center p-4">
                                        <p className="text-red-400">Preview Failed to Load</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(previewUrl || '', '_blank')}
                                            disabled={!previewUrl}
                                            className="text-white border-white/20"
                                        >
                                            View Full Report <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("details")}
                                    className="flex-1 border-white/10 hover:bg-white/5 text-gray-400 order-3 sm:order-1"
                                >
                                    Iterate / Edit
                                </Button>
                                <Button
                                    onClick={async () => {
                                        if (previewUrl) {
                                            const link = document.createElement('a');
                                            link.href = previewUrl;
                                            link.download = `Zeniac_Intelligence_Report_${formData.website.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    }}
                                    disabled={!previewUrl}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white order-2 sm:order-2"
                                >
                                    Download PDF
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="flex-1 bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold order-1 sm:order-3"
                                >
                                    Email Report
                                </Button>
                            </div>
                        </StepContainer>
                    )}

                    {step === "email" && (
                        <StepContainer key="email">
                            <WizardHeader
                                title="Secure Transmission"
                                subtitle="Where should we send your strategic roadmap?"
                            />
                            <div className="space-y-6 mt-8 max-w-md mx-auto w-full">
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        className="bg-white/5 border-white/10 focus:border-zeniac-gold text-lg py-6 relative z-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="ceo@company.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            setSendError(null);
                                        }}
                                        disabled={isSending}
                                        autoComplete="email"
                                    />
                                    {sendError && (
                                        <p className="text-xs text-red-500 mt-2 font-mono uppercase">
                                            ⚠️ {sendError}
                                        </p>
                                    )}
                                </div>
                                <div className="pt-4 flex justify-center">
                                    <Button
                                        onClick={handleNext}
                                        size="lg"
                                        className="w-full bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold h-14"
                                        disabled={!formData.email.includes("@") || isSending}
                                    >
                                        {isSending ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                SENDING REPORT...
                                            </div>
                                        ) : (
                                            "SEND PDF REPORT"
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                                    This report includes the complete Architecture Overhaul plan.<br />
                                    Check your spam folder if it doesn't arrive in 2 minutes.
                                </p>
                            </div>
                        </StepContainer>
                    )}

                    {step === "success" && (
                        <StepContainer key="success">
                            <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto pt-10">
                                <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20 mb-4 animate-in zoom-in duration-500">
                                    <Check className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-mono font-bold text-white">
                                    Sent.
                                </h2>
                                <p className="text-gray-400">
                                    Check your inbox for a document titled <strong>&quot;Zeniac_Intelligence_Report.pdf&quot;</strong>.
                                </p>
                                <div className="bg-white/5 p-6 rounded-lg border border-white/10 w-full mt-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-zeniac-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-zeniac-gold text-xs font-bold">1</span>
                                        </div>
                                        <p className="text-sm text-gray-300">
                                            Check your <strong>Spam/Junk</strong> folder if it doesn&apos;t appear in 1-2 minutes.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-zeniac-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-zeniac-gold text-xs font-bold">2</span>
                                        </div>
                                        <p className="text-sm text-gray-300">
                                            Mark it as <strong>&quot;Not Spam&quot;</strong> to ensure you receive future competitive updates.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full mt-6">
                                    <Button
                                        onClick={() => {
                                            closeWizard();
                                            onOpenBooking?.({
                                                name: formData.name,
                                                email: formData.email,
                                                website: formData.website
                                            });
                                        }}
                                        className="bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold h-12"
                                    >
                                        BOOK STRATEGY CALL <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>

                                    {/* Debug Info Section */}
                                    {analysisData?.debug && (
                                        <div className="mt-8 border-t border-white/10 pt-6 text-left w-full">
                                            <details className="group">
                                                <summary className="cursor-pointer text-xs text-zeniac-gray hover:text-white flex items-center gap-2">
                                                    <span>🛠️ Debug Info (API Diagnostics)</span>
                                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                                </summary>
                                                <div className="mt-4 space-y-4 text-xs font-mono bg-black/50 p-4 rounded-lg overflow-x-auto">
                                                    <div>
                                                        <h4 className="text-zeniac-gold mb-1">Social Analysis Script</h4>
                                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                                            <span className="text-gray-500">Status:</span>
                                                            <span className={analysisData.debug.social.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                                                                {analysisData.debug.social.status}
                                                            </span>
                                                            {analysisData.debug.social.error && (
                                                                <>
                                                                    <span className="text-gray-500">Error:</span>
                                                                    <span className="text-red-300">{analysisData.debug.social.error}</span>
                                                                </>
                                                            )}
                                                            {analysisData.debug.social.stderr && (
                                                                <>
                                                                    <span className="text-gray-500">Stderr:</span>
                                                                    <pre className="text-orange-300 whitespace-pre-wrap">{analysisData.debug.social.stderr}</pre>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => closeWizard()}
                                        variant="ghost"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Return to Site
                                    </Button>
                                </div>
                            </div>
                        </StepContainer>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}

function StepContainer({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden flex flex-col h-full"
        >
            <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col justify-center">
                {children}
            </div>
        </motion.div>
    );
}

function WizardHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="text-center space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold font-typewriter text-white">{title}</h3>
            <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
        </div>
    );
}

function ProcessingSteps() {
    const [status, setStatus] = React.useState("Initializing Scan...");
    const [mounted, setMounted] = React.useState(false);

    const { setProgress, resetWizard } = useWizard();

    React.useEffect(() => {
        setMounted(true);
        const steps = [
            { text: "Initializing Scan...", time: 3000, prog: 5 },
            { text: "Scraping Website Architecture...", time: 12000, prog: 20 },
            { text: "Extracting Tech Stack Signal...", time: 8000, prog: 35 },
            { text: "Evaluating SEO Hierarchy...", time: 10000, prog: 50 },
            { text: "Analyzing Competitor Authority...", time: 15000, prog: 70 },
            { text: "Quantifying Revenue Leakage...", time: 10000, prog: 85 },
            { text: "Generating Performance Gauge...", time: 7000, prog: 95 },
            { text: "Finalizing Intelligence Report...", time: 0, prog: 100 }
        ];

        let currentStep = 0;
        let timeout: NodeJS.Timeout;

        const nextStep = () => {
            if (currentStep < steps.length) {
                const s = steps[currentStep];
                setStatus(s.text);
                setProgress(s.prog);
                if (s.time > 0 && currentStep < steps.length - 1) {
                    timeout = setTimeout(() => {
                        currentStep++;
                        nextStep();
                    }, s.time);
                }
            }
        };

        nextStep();
        return () => clearTimeout(timeout);
    }, [setProgress]);

    if (!mounted) return null;

    return (
        <div className="w-full max-w-xs mx-auto mt-4 space-y-4">
            <div className="flex flex-col items-center gap-2 justify-center">
                <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-zeniac-gold" />
                    <span className="text-xs text-gray-500 font-mono">{status}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-zeniac-gold"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 70, ease: "linear" }}
                    />
                </div>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => resetWizard()}
                className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest border border-white/5"
            >
                Cancel & Restart Scan
            </Button>
        </div>
    );
}
