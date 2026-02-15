"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolkitSurveyProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: SurveyData) => void;
}

export interface SurveyData {
    industry: string;
    struggle: string;
    revenueRange: string;
    email: string;
}

export function ToolkitSurvey({ isOpen, onClose, onComplete }: ToolkitSurveyProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<SurveyData>({
        industry: "",
        struggle: "",
        revenueRange: "",
        email: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (getIsStepValid()) {
            if (step < 4) setStep(step + 1);
            else handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        onComplete(data);
        setIsSubmitting(false);
        onClose();
    };

    const getIsStepValid = () => {
        if (step === 1) return !!data.industry;
        if (step === 2) return !!data.struggle;
        if (step === 3) return !!data.revenueRange;
        if (step === 4) return !!data.email;
        return false;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-lg bg-zeniac-charcoal border border-zeniac-gold/30 p-8 rounded-none relative overflow-hidden"
                >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-zeniac-gold transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />

                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zeniac-gold/10 border border-zeniac-gold/20 mb-4 rounded-full">
                            <Sparkles className="w-3 h-3 text-zeniac-gold" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zeniac-gold">
                                Analyzing Business DNA
                            </span>
                        </div>
                        <h2 className="text-2xl font-typewriter font-black text-zeniac-white uppercase">
                            CALIBRATE YOUR TOOLKIT
                        </h2>
                        <p className="text-muted-foreground font-mono text-sm mt-2">
                            Step {step} of 4: Customizing your 20 tools...
                        </p>
                    </div>

                    <div className="min-h-[220px]">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label className="text-zeniac-gold font-mono uppercase">What is your primary industry?</Label>
                                <Select onValueChange={(val) => setData({ ...data, industry: val })} value={data.industry}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white font-mono h-12">
                                        <SelectValue placeholder="Select Industry" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zeniac-charcoal border-white/10 text-white font-mono">
                                        <SelectItem value="salon_beauty">Salon / Beauty / Spa</SelectItem>
                                        <SelectItem value="restaurant_food">Restaurant / Cafe / Food</SelectItem>
                                        <SelectItem value="retail_fashion">Retail / Fashion / E-com</SelectItem>
                                        <SelectItem value="real_estate">Real Estate / Housing</SelectItem>
                                        <SelectItem value="professional_services">Professional Services (Legal, Consulting)</SelectItem>
                                        <SelectItem value="health_fitness">Health / Fitness / Gym</SelectItem>
                                        <SelectItem value="tech_saas">Tech / SaaS / Agency</SelectItem>
                                        <SelectItem value="other">Other / General Business</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label className="text-zeniac-gold font-mono uppercase">What is your #1 biggest struggle?</Label>
                                <RadioGroup onValueChange={(val) => setData({ ...data, struggle: val })} value={data.struggle} className="space-y-2">
                                    {[
                                        { val: "leads", label: "Getting more paying customers (Leads)" },
                                        { val: "social", label: "Consistency on Social Media" },
                                        { val: "branding", label: "Looking professional (Branding)" },
                                        { val: "time", label: "Too much manual work (Automation)" },
                                        { val: "visibility", label: "Nobody knows we exist (SEO/Awareness)" }
                                    ].map((opt) => (
                                        <div key={opt.val} className={cn(
                                            "flex items-center space-x-3 p-3 border cursor-pointer transition-colors",
                                            data.struggle === opt.val ? "border-zeniac-gold bg-zeniac-gold/10" : "border-white/10 hover:border-white/30"
                                        )}
                                            onClick={() => setData({ ...data, struggle: opt.val })}
                                        >
                                            <RadioGroupItem value={opt.val} id={opt.val} className="border-zeniac-gold text-zeniac-gold" />
                                            <Label htmlFor={opt.val} className="font-mono text-sm text-zeniac-white cursor-pointer w-full pointer-events-none">
                                                {opt.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label className="text-zeniac-gold font-mono uppercase">Current Monthly Revenue Range?</Label>
                                <p className="text-xs text-muted-foreground font-mono mb-2">Used to calibrate your Revenue Calculator tool.</p>
                                <Select onValueChange={(val) => setData({ ...data, revenueRange: val })} value={data.revenueRange}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white font-mono h-12">
                                        <SelectValue placeholder="Select Revenue Range" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zeniac-charcoal border-white/10 text-white font-mono">
                                        <SelectItem value="0_50k">Under KES 50,000 / $500</SelectItem>
                                        <SelectItem value="50k_200k">KES 50K - 200K / $500 - $2k</SelectItem>
                                        <SelectItem value="200k_1m">KES 200K - 1M / $2k - $10k</SelectItem>
                                        <SelectItem value="1m_plus">Over KES 1M / $10k+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label className="text-zeniac-gold font-mono uppercase">Confirm Delivery Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter your best email"
                                    className="bg-white/5 border-white/10 text-white font-mono h-12"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                                <div className="p-4 bg-zeniac-gold/5 border border-zeniac-gold/20 mt-4">
                                    <h4 className="text-zeniac-gold font-mono text-sm uppercase mb-2 flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Ready to Generate:
                                    </h4>
                                    <ul className="text-xs font-mono text-muted-foreground space-y-1 ml-6 list-disc">
                                        <li>Industry-specific Content Calendar ({data.industry || "Analyzing..."})</li>
                                        <li>High-converting Reel Scripts ({data.struggle || "Identifying..."} focus)</li>
                                        <li>Revenue Calculator (Calibrated to {data.revenueRange || "Checking..."})</li>
                                        <li>+ 17 more tools...</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        <Button
                            variant="ghost"
                            onClick={() => step > 1 && setStep(step - 1)}
                            className={cn("text-muted-foreground hover:text-white font-mono hover:bg-white/5", step === 1 && "opacity-0 pointer-events-none")}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!getIsStepValid() || isSubmitting}
                            className="bg-zeniac-gold text-zeniac-black hover:bg-zeniac-gold/90 font-typewriter font-black uppercase min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : step === 4 ? (
                                "GENERATE NOW"
                            ) : (
                                <span className="flex items-center">Next <ArrowRight className="w-4 h-4 ml-2" /></span>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
