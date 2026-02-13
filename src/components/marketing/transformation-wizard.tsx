"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming standard shadcn Input
import { Label } from "@/components/ui/label";
import { Activity, ArrowRight, Check, ChevronRight, Loader2, Search, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { pdf } from '@react-pdf/renderer';
import { AuditPDF } from '@/components/reports/AuditPDF';

interface WizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenBooking?: (data: any) => void;
}

type Step = "intro" | "details" | "pain" | "processing" | "results" | "preview" | "email" | "success";

export function TransformationWizard({ open, onOpenChange, onOpenBooking }: WizardProps) {
    const [step, setStep] = React.useState<Step>("intro");
    const [formData, setFormData] = React.useState({
        name: "",
        website: "",
        painPoints: [] as string[],
        email: "",
    });
    const [isSending, setIsSending] = React.useState(false);
    const [sendError, setSendError] = React.useState<string | null>(null);

    // Reset when closed
    React.useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setStep("intro");
                setFormData({ name: "", website: "", painPoints: [], email: "" });
                setPreviewUrl(null);
            }, 300);
        }
    }, [open]);

    const [analysisData, setAnalysisData] = React.useState<any>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [generatingPdf, setGeneratingPdf] = React.useState(false);

    const performAnalysis = async () => {
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: formData.website || "zeniac.co" }),
            });
            const data = await response.json();
            if (data.success) {
                setAnalysisData(data.data);
            }
        } catch (error) {
            console.error("Analysis failed:", error);
            // Fallback for demo if API fails, but log it
            // TODO: Remove this fallback once API signals are verified
            setAnalysisData({
                score: 42,
                techStack: "Undetected (API Error)",
                competitorGap: "High",
                hasSocialProof: false,
                hasClearCTA: false,
                businessType: "Unknown",
                services: [],
                inferredPainPoints: ["Analysis API unreachable", "Check console for details"],
                location: "Unknown",
                debug: null // Fallback
            });
        } finally {
            setStep("results");
        }
    };

    React.useEffect(() => {
        if (step === "processing") {
            performAnalysis();
        }
    }, [step]);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Generate PDF Preview when entering "preview" step
    React.useEffect(() => {
        const generatePreview = async () => {
            if (step === "preview" && analysisData && mounted) {
                setGeneratingPdf(true);
                try {
                    console.log("Starting PDF generation for preview...");
                    const blob = await pdf(
                        <AuditPDF
                            analysis={analysisData}
                            website={formData.website}
                            name={formData.name}
                            email={formData.email}
                            reportDate={new Date().toLocaleDateString()}
                        />
                    ).toBlob();
                    console.log("PDF generated successfully as Blob. Size:", blob.size);
                    const url = URL.createObjectURL(blob);
                    setPreviewUrl(url);
                    console.log("Preview URL set successfully.");
                } catch (e) {
                    console.error("PDF Generation failed at component level:", e);
                } finally {
                    setGeneratingPdf(false);
                }
            }
        };

        generatePreview();
    }, [step, analysisData, mounted]);

    // ENTER KEY HANDLER - Navigate through wizard
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && open) {
                // Check if we are in a textarea (we want newlines there)
                if (document.activeElement?.tagName === 'TEXTAREA') return;

                e.preventDefault();
                // Blur active input to ensure state is committed (especially for some browsers)
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }

                // Use a slightly longer delay to ensure React state updates from blur if necessary
                setTimeout(() => {
                    handleNext();
                }, 100);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [open, step, formData]);


    const handleNext = async () => {
        if (step === "intro") setStep("details");
        // Skip "pain" step, go straight to processing which triggers the useEffect scan
        else if (step === "details") {
            setStep("processing");
        }
        else if (step === "results") {
            setStep("preview"); // Move to Preview instead of Email
        }
        else if (step === "preview") {
            setStep("email");
        }
        else if (step === "email") {
            // STRICT VALIDATION - Prevent Enter key bypass
            if (!formData.email.includes("@") || !formData.email.includes(".")) {
                setSendError("Please enter a valid email address (e.g. name@company.com)");
                return;
            }

            setIsSending(true);
            setSendError(null);
            // Submit to Backend
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
                    // Not JSON - likely a 500 or 404 HTML page from Next.js
                    if (!response.ok) {
                        console.error("Non-JSON error response:", await response.text());
                        throw new Error(`Server Error (${response.status}): The email service is temporarily unavailable.`);
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
            onOpenChange(false);
        }
    };

    // Remove togglePainPoint function as it's no longer needed

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[80vh] bg-zeniac-black/95 border-white/10 text-white backdrop-blur-xl p-0 overflow-hidden flex flex-col">
                <DialogTitle className="sr-only">Zeniac Transformation Wizard</DialogTitle>
                <DialogDescription className="sr-only">
                    Interactive questionnaire to analyze your digital presence and generate a strategic roadmap.
                </DialogDescription>
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-zeniac-gold"
                        initial={{ width: "0%" }}
                        animate={{
                            width: step === "intro" ? "10%" :
                                step === "details" ? "30%" :
                                    step === "processing" ? "50%" :
                                        step === "results" ? "75%" :
                                            step === "preview" ? "85%" : "100%"
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

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
                                {/* Gauge Container - Increased size for 'safe zone' to prevent clipping */}
                                <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-zeniac-gold/20 blur-xl rounded-full" />

                                    {/* SVG Gauge - responsive sizing with explicit viewBox to prevent clipping */}
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
                                            animate={{ strokeDashoffset: 100 }}
                                            transition={{ duration: 3, ease: "easeInOut" }}
                                        />
                                    </svg>

                                    {/* Score Display - Centered overlay */}
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

                                {/* Status Text */}
                                <div className="space-y-3 max-w-md">
                                    <h3 className="text-xl sm:text-2xl font-mono font-bold text-white">
                                        Analyzing <span className="text-zeniac-gold">{formData.website || "System"}</span>...
                                    </h3>
                                    <ProcessingSteps />
                                </div>
                            </div>
                        </StepContainer>
                    )}

                    {step === "results" && (
                        <StepContainer key="results">
                            <WizardHeader
                                title="Intelligence Report"
                                subtitle="Analysis complete. Critical gaps detected."
                            />

                            <div className="grid md:grid-cols-2 gap-6 mt-8">
                                {/* Score Card */}
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

                                {/* Competitor Card */}
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

                            {/* Business Details Extracted */}
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

                            <div className="flex gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1 border-white/10 hover:bg-white/5 text-gray-400"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="flex-[2] bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold"
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
                            <div className="mt-4 border border-white/10 rounded-lg p-1 bg-white/5 h-[350px] md:h-[450px] overflow-hidden relative group flex items-center justify-center">
                                {generatingPdf ? (
                                    <div className="flex flex-col items-center text-gray-400 animate-pulse">
                                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-zeniac-gold" />
                                        <p>Generating PDF Report...</p>
                                    </div>
                                ) : previewUrl ? (
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-full rounded bg-white"
                                        title="Report Preview"
                                    />
                                ) : (
                                    <p className="text-red-400">Preview Failed to Load</p>
                                )}
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("details")}
                                    className="flex-1 border-white/10 hover:bg-white/5 text-gray-400"
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
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                                >
                                    Download PDF
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="flex-1 bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold"
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
                                        className="bg-white/5 border-white/10 focus:border-zeniac-gold text-lg py-6"
                                        placeholder="ceo@company.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            setSendError(null);
                                        }}
                                        disabled={isSending}
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
                                    Check your inbox for a document titled <strong>"Zeniac_Intelligence_Report.pdf"</strong>.
                                </p>
                                <div className="bg-white/5 p-6 rounded-lg border border-white/10 w-full mt-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-zeniac-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-zeniac-gold text-xs font-bold">1</span>
                                        </div>
                                        <p className="text-sm text-gray-300">
                                            Check your <strong>Spam/Junk</strong> folder if it doesn't appear in 1-2 minutes.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-zeniac-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-zeniac-gold text-xs font-bold">2</span>
                                        </div>
                                        <p className="text-sm text-gray-300">
                                            Mark it as <strong>"Not Spam"</strong> to ensure you receive future competitive updates.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full mt-6">
                                    <Button
                                        onClick={() => {
                                            onOpenChange(false);
                                            onOpenBooking?.({
                                                name: formData.name,
                                                email: formData.email,
                                                website: formData.website
                                            });
                                        }}
                                        className="bg-zeniac-gold text-black hover:bg-zeniac-gold/90 font-bold h-12"
                                    >
                                        BOOK DISCOVERY CALL <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>

                                    {/* Debug Info Section */}
                                    {analysisData.debug && (
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

                                                    <div className="border-t border-white/10 pt-4">
                                                        <h4 className="text-zeniac-gold mb-1">Competitor Research Script</h4>
                                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                                            <span className="text-gray-500">Status:</span>
                                                            <span className={analysisData.debug.competitor.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                                                                {analysisData.debug.competitor.status}
                                                            </span>
                                                            {analysisData.debug.competitor.error && (
                                                                <>
                                                                    <span className="text-gray-500">Error:</span>
                                                                    <span className="text-red-300">{analysisData.debug.competitor.error}</span>
                                                                </>
                                                            )}
                                                            {analysisData.debug.competitor.stderr && (
                                                                <>
                                                                    <span className="text-gray-500">Stderr:</span>
                                                                    <pre className="text-orange-300 whitespace-pre-wrap">{analysisData.debug.competitor.stderr}</pre>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => onOpenChange(false)}
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

// Subcomponents

function StepContainer({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-100px)] flex flex-col"
        >
            {children}
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

    React.useEffect(() => {
        setMounted(true);
        const steps = [
            "Scanning Tech Stack...",
            "Evaluating SEO Signals...",
            "Computing Brand Authority...",
            "Comparing against 3 Local Competitors...",
            "Quantifying Revenue Leak...",
            "Finalizing Report..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                setStatus(steps[i]);
                i++;
            }
        }, 600);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return <p className="font-mono text-zeniac-gold/80 text-sm">{`> Initializing Scan...`}</p>;
    }

    return (
        <p className={cn(
            "font-mono text-zeniac-gold/80 text-sm",
            mounted && "animate-pulse"
        )}>
            {`> ${status}`}
        </p>
    );
}

function CountingNumber({ value }: { value: number }) {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += value / steps;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepTime);
        return () => clearInterval(timer);
    }, [value]);

    return <>{count}</>;
}

