import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GoldParticlesProps {
  count?: number;
  isNight?: boolean;
}

export default function GoldParticles({ count = 50, isNight = true }: GoldParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      speeds[i] = Math.random() * 0.3 + 0.1;
    }

    return { positions, speeds };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const speed = particles.speeds[i];
      positions[i * 3 + 1] += Math.sin(time * speed + i) * 0.001;
      positions[i * 3] += Math.cos(time * speed * 0.5 + i) * 0.0005;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
  });

  const particleColor = isNight ? "#D4AF37" : "#C41E3A";
  const opacity = isNight ? 0.8 : 0.5;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={particleColor}
        size={0.04}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
