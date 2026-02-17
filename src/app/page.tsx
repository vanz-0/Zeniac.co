"use client";

import { useState } from "react";
import { HeroAnimation } from "@/components/marketing/hero-animation";
import { SocialProof } from "@/components/marketing/social-proof";
import { BentoGrid } from "@/components/marketing/bento-grid";
import RadialOrbitalTimeline from "@/components/marketing/orbital-process";
import { MinimalFooter } from "@/components/marketing/footer";
import { Pricing } from "@/components/marketing/pricing";
import { Reviews } from "@/components/marketing/reviews";
import { Portfolio } from "@/components/marketing/portfolio";
import { FAQ } from "@/components/marketing/faq";
import { PreFooterCTA } from "@/components/marketing/pre-footer-cta";
import { Brain, Lightbulb, PenTool, Rocket, Search, Settings } from "lucide-react";
import { TransformationWizard } from "@/components/marketing/transformation-wizard";
import { useWizard } from "@/context/wizard-context";
import { Navbar } from "@/components/marketing/navbar";
import { BookingModal } from "@/components/marketing/booking-modal";
import { DominanceVault, VaultPopup } from "@/components/marketing/dominance-vault";
import { TemplatePoll } from "@/components/marketing/template-poll";

const processData = [
  {
    id: 1,
    title: "INITIALIZATION",
    date: "Phase 01",
    content: "Comprehensive digital footprint analysis. We deep-dive into your current brand perception, SEO standing, and market gaps to identify why you aren't #1.",
    category: "Analysis",
    icon: Search,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "ARCHITECTURE",
    date: "Phase 02",
    content: "Blueprint for market dominance. Identifying high-value keywords, content opportunities, and the strategic path to immediate wins.",
    category: "Planning",
    icon: Brain,
    relatedIds: [3, 4],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "PRODUCTION",
    date: "Phase 03",
    content: "Creation of premium visual assets. High-end photography, videography, and branded design that elevates your perceived value instantly.",
    category: "Creative",
    icon: PenTool,
    relatedIds: [4],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "ENGINEERING",
    date: "Phase 04",
    content: "Technical overhaul using Zeniac OS. We implement lightning-fast, mobile-first indexing to maximize speed and conversion rates.",
    category: "Tech",
    icon: Settings,
    relatedIds: [5],
    status: "pending" as const,
    energy: 70,
  },
  {
    id: 5,
    title: "ACTIVATION",
    date: "Phase 05",
    content: "Synchronized multi-channel launch. Ads, social campaigns, and GMB updates hit simultaneously to flood your business with leads.",
    category: "Launch",
    icon: Rocket,
    relatedIds: [6],
    status: "pending" as const,
    energy: 60,
  },
  {
    id: 6,
    title: "DOMINANCE",
    date: "Phase 06",
    content: "Automated reputation management and continuous optimization to secure your position as the undisputed market leader.",
    category: "Growth",
    icon: Lightbulb,
    relatedIds: [],
    status: "pending" as const,
    energy: 50,
  },
];

export default function Home() {
  const { openWizard } = useWizard();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const openBooking = (data?: any) => {
    if (data) setBookingData(data);
    setBookingOpen(true);
  };

  return (
    <div className="relative bg-zeniac-black min-h-screen text-foreground selection:bg-zeniac-gold/30">
      <Navbar onOpenWizard={openWizard} onOpenBooking={() => openBooking()} />

      <div className="relative z-10">
        <HeroAnimation onOpenWizard={openWizard} onOpenBooking={() => openBooking()} />

        <SocialProof />

        <div id="solutions">
          <BentoGrid />
        </div>

        <Portfolio />
        <Pricing onOpenBooking={() => openBooking()} />

        <DominanceVault />
        <TemplatePoll />

        <Reviews />

        <section id="process" className="relative py-24 min-h-screen flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 text-center mb-8 relative z-20">
            <h2 className="text-3xl md:text-5xl font-typewriter font-black text-zeniac-white mb-6">
              THE <span className="text-zeniac-gold">PROCESS</span>
            </h2>
            <p className="text-muted-foreground font-mono max-w-2xl mx-auto">
              A systematic approach to building operational sovereignty and digital dominance. Whether you're a local startup or a scaling entity, we engineer your systems.
            </p>
          </div>
          <RadialOrbitalTimeline timelineData={processData} />
        </section>

        <FAQ />
        <PreFooterCTA onOpenWizard={openWizard} />

        <MinimalFooter />
      </div>

      <TransformationWizard
        onOpenBooking={(data) => openBooking(data)}
      />

      <VaultPopup />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        userData={bookingData}
      />
    </div>
  );
}
