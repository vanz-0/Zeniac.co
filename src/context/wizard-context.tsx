"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

import { AnalysisData } from '@/types/analysis';

type Step = "intro" | "details" | "pain" | "processing" | "results" | "preview" | "email" | "success";

interface WizardContextType {
    isOpen: boolean;
    isMinimized: boolean;
    step: Step;
    progress: number;
    analysisData: AnalysisData | null;
    formData: {
        name: string;
        website: string;
        painPoints: string[];
        email: string;
    };
    // Actions
    openWizard: () => void;
    closeWizard: () => void;
    minimizeWizard: () => void;
    restoreWizard: () => void;
    setStep: (step: Step) => void;
    setProgress: (progress: number) => void;
    setAnalysisData: (data: AnalysisData | null) => void;
    setFormData: (data: any) => void;
    resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [step, setStep] = useState<Step>("intro");
    const [progress, setProgress] = useState(0);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        website: "",
        painPoints: [] as string[],
        email: "",
    });

    const openWizard = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const closeWizard = () => {
        setIsOpen(false);
        // We do NOT reset state here if it's processing to allow background completion logic if needed,
        // but typically closing implies "I'm done".
        // However, if the user explicitly cancels, they should use a cancel action.
        // For now, if we close while processing, let's treat it as minimize unless specified?
        // Actually, the requirement is "if processing -> minimize".
        // The Component calling closeWizard should decide.
        // But for a hard close:
        if (step !== "processing" && step !== "results" && step !== "preview" && step !== "success") {
            // If we are just in intro/details, reset on close
            setTimeout(() => resetWizard(), 300);
        }
    };

    const minimizeWizard = () => {
        setIsOpen(false);
        setIsMinimized(true);
    };

    const restoreWizard = () => {
        setIsMinimized(false);
        setIsOpen(true);
    };

    const resetWizard = () => {
        setStep("intro");
        setProgress(0);
        setAnalysisData(null);
        setFormData({ name: "", website: "", painPoints: [], email: "" });
        setIsMinimized(false);
    };

    return (
        <WizardContext.Provider value={{
            isOpen,
            isMinimized,
            step,
            progress,
            analysisData,
            formData,
            openWizard,
            closeWizard,
            minimizeWizard,
            restoreWizard,
            setStep,
            setProgress,
            setAnalysisData,
            setFormData,
            resetWizard
        }}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error('useWizard must be used within a WizardProvider');
    }
    return context;
}
