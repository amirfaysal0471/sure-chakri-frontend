import LeaderboardPage from "@/app/(public)/leaderboard/page";
import ExamCategories from "@/app/components/public/landing/ExamCategories";
import FinalCTASection from "@/app/components/public/landing/FinalCTASection";
import HeroSection from "@/app/components/public/landing/Hero";
import LiveTickerSection from "@/app/components/public/landing/LiveExamTicker";
import PricingSection from "@/app/components/public/landing/PricingSection";
import WhyUsSection from "@/app/components/public/landing/WhyUsSection";

export default function page() {
  return (
    <div>
      <HeroSection />
      <LiveTickerSection />
      <WhyUsSection />
      <ExamCategories />
      <LeaderboardPage />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
}
