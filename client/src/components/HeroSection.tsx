import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import LipstickModel from "./LipstickModel";
import GoldParticles from "./GoldParticles";

export default function HeroSection() {
  const { isNight } = useTheme();

  const scrollToProducts = () => {
    const el = document.querySelector("#collection");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative h-[100vh] min-h-[700px] overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: isNight ? "#050505" : "#faf7f4" }}
    >
      {/* 3D Scene - Full viewport background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={isNight ? 0.2 : 0.6} />
            <directionalLight
              position={[5, 8, 3]}
              intensity={isNight ? 1.5 : 1.2}
              color={isNight ? "#D4AF37" : "#C41E3A"}
            />
            <pointLight
              position={[-3, 2, 4]}
              intensity={isNight ? 0.8 : 0.5}
              color={isNight ? "#D4AF37" : "#B5485D"}
              distance={10}
            />
            <pointLight
              position={[2, -3, 2]}
              intensity={0.3}
              color={isNight ? "#8B0000" : "#C4A882"}
              distance={8}
            />
            <spotLight
              position={[0, 5, 5]}
              angle={0.3}
              penumbra={0.8}
              intensity={1}
              color="#ffffff"
            />

            <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
              <LipstickModel isNight={isNight} shade="red" position={[0, -0.5, 0]} scale={2.2} />
            </Float>

            <GoldParticles isNight={isNight} />
            <Environment preset={isNight ? "night" : "studio"} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none p-6 md:p-10">
        {/* Bottom section - Explore button + scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="flex justify-between items-end"
        >
          {/* Explore button */}
          <motion.button
            onClick={scrollToProducts}
            className="pointer-events-auto group flex items-center gap-3 transition-opacity duration-300 hover:opacity-100 opacity-80"
            data-cursor-hover
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-sans text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--theme-accent)" }}
            >
              Explore
            </span>
            <svg
              width="24"
              height="8"
              viewBox="0 0 24 8"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M0 4H22M22 4L18 1M22 4L18 7"
                stroke="var(--theme-accent)"
                strokeWidth="0.8"
              />
            </svg>
          </motion.button>

          {/* Scroll indicator */}
          <motion.span
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="font-sans text-[9px] tracking-[0.35em] uppercase"
            style={{ color: "var(--theme-muted)" }}
          >
            scroll
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
