import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ScrollStory from "@/components/ScrollStory";
import Marquee from "@/components/Marquee";
import AboutSection from "@/components/AboutSection";
import CollectionSection from "@/components/CollectionSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import PaymentLogos from "@/components/PaymentLogos";
import NewsletterPopup from "@/components/NewsletterPopup";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { isNight } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-1000"
      style={{ backgroundColor: isNight ? "#050505" : "#faf7f4" }}
    >
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {loaded && (
        <>
          <Navigation />
          <HeroSection />
          <ScrollStory />
          <Marquee />
          <AboutSection />
          <CollectionSection />
          <Marquee />
          <ExperienceSection />
          <PaymentLogos />
          <ContactSection />
          <NewsletterPopup />
          <Chatbot />
        </>
      )}
    </div>
  );
}
