import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useTheme } from "@/contexts/ThemeContext";
import LipstickModel from "./LipstickModel";

const SHADES = [
  { id: "nude", name: "Nude Silk", color: "#C4956A" },
  { id: "rose", name: "Rose Petal", color: "#B5485D" },
  { id: "red", name: "Red Passion", color: "#C41E3A" },
  { id: "berry", name: "Berry Luxe", color: "#8E4585" },
  { id: "wine", name: "Dark Wine", color: "#4A0E2E" },
];

export default function ExperienceSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { isNight } = useTheme();
  const [activeShade, setActiveShade] = useState("red");

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: isNight ? "#030303" : "#f5f0ea" }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: 0.03,
          backgroundImage: `linear-gradient(${accentColor}4D 1px, transparent 1px), linear-gradient(90deg, ${accentColor}4D 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <h2
            className="font-display text-[8vw] md:text-[5vw] lg:text-[3.5vw] font-light leading-[1.1] transition-colors duration-700"
            style={{ color: isNight ? "rgba(255,255,255,0.9)" : "rgba(13,5,5,0.9)" }}
          >
            The <span className="italic" style={{ color: accentColor }}>Experience</span>
          </h2>
          <p
            className="font-serif-body text-lg md:text-xl mt-6 max-w-lg transition-colors duration-700"
            style={{ color: isNight ? "rgba(255,255,255,0.4)" : "rgba(13,5,5,0.4)" }}
          >
            Rotate. Zoom. Explore. Each shade is a world unto itself.
          </p>
        </motion.div>

        {/* 3D Canvas + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 relative h-[50vh] md:h-[70vh] transition-colors duration-700"
            style={{ border: `1px solid ${isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.15)"}` }}
          >
            {/* Corner markers */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: `${accentColor}4D` }} />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r" style={{ borderColor: `${accentColor}4D` }} />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l" style={{ borderColor: `${accentColor}4D` }} />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: `${accentColor}4D` }} />

            <Canvas
              camera={{ position: [0, 0, 4.5], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={isNight ? 0.15 : 0.5} />
                <directionalLight position={[5, 8, 3]} intensity={isNight ? 1.8 : 1.3} color={accentColor} />
                <pointLight position={[-3, 2, 4]} intensity={isNight ? 0.6 : 0.4} color={accentColor} distance={10} />
                <pointLight position={[2, -2, 3]} intensity={0.4} color={isNight ? "#8B0000" : "#C4A882"} distance={8} />
                <spotLight position={[0, 6, 4]} angle={0.25} penumbra={0.8} intensity={1.2} color="#fff" />

                <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.3}>
                  <LipstickModel isNight={isNight} shade={activeShade} position={[0, -0.3, 0]} scale={1.8} />
                </Float>

                <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={6} blur={2.5} color={accentColor} />
                <Environment preset={isNight ? "night" : "studio"} />
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  maxDistance={7}
                  minDistance={2.5}
                  maxPolarAngle={Math.PI / 1.5}
                  minPolarAngle={Math.PI / 4}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
              </Suspense>
            </Canvas>

            {/* Overlay labels */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
              <span
                className="font-sans text-[8px] tracking-[0.2em] uppercase"
                style={{ color: isNight ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}
              >
                drag to rotate
              </span>
              <span
                className="font-sans text-[8px] tracking-[0.2em] uppercase"
                style={{ color: isNight ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}
              >
                scroll to zoom
              </span>
            </div>
          </motion.div>

          {/* Shade selector */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <div
              className="p-8 md:p-10 transition-colors duration-700"
              style={{ border: `1px solid ${isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.15)"}` }}
            >
              <span
                className="font-sans text-[9px] tracking-[0.35em] uppercase block mb-8 transition-colors duration-700"
                style={{ color: isNight ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}
              >
                Select Shade
              </span>

              <div className="flex flex-col gap-4">
                {SHADES.map((shade) => (
                  <button
                    key={shade.id}
                    onClick={() => setActiveShade(shade.id)}
                    className="group flex items-center gap-4 p-3 transition-all duration-500"
                    style={{
                      border: activeShade === shade.id
                        ? `1px solid ${accentColor}66`
                        : `1px solid transparent`,
                      backgroundColor: activeShade === shade.id
                        ? (isNight ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)")
                        : "transparent",
                    }}
                    data-cursor-hover
                  >
                    <div
                      className="w-6 h-6 rounded-full transition-transform duration-300"
                      style={{
                        backgroundColor: shade.color,
                        transform: activeShade === shade.id ? "scale(1.25)" : "scale(1)",
                      }}
                    />
                    <span
                      className="font-sans text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
                      style={{
                        color: activeShade === shade.id
                          ? accentColor
                          : (isNight ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"),
                      }}
                    >
                      {shade.name}
                    </span>
                    {activeShade === shade.id && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto font-sans text-[8px]"
                        style={{ color: accentColor }}
                      >
                        &#9679;
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>

              {/* Finish options */}
              <div
                className="mt-10 pt-8 transition-colors duration-700"
                style={{ borderTop: `1px solid ${isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.15)"}` }}
              >
                <span
                  className="font-sans text-[9px] tracking-[0.35em] uppercase block mb-4 transition-colors duration-700"
                  style={{ color: isNight ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}
                >
                  Finish
                </span>
                <div className="flex gap-2">
                  {["Matte", "Satin", "Gloss"].map((finish) => (
                    <span
                      key={finish}
                      className="font-sans text-[9px] tracking-[0.15em] uppercase px-3 py-2 transition-all duration-300 cursor-pointer"
                      style={{
                        border: `1px solid ${isNight ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        color: isNight ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
                      }}
                      data-cursor-hover
                    >
                      {finish}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
