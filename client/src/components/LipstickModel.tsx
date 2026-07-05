import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SHADE_COLORS: Record<string, string> = {
  nude: "#C4956A",
  rose: "#B5485D",
  red: "#C41E3A",
  berry: "#8E4585",
  wine: "#4A0E2E",
  coral: "#E8735A",
  mauve: "#9B6B8C",
  plum: "#6B2D5B",
};

interface LipstickModelProps {
  isNight?: boolean;
  shade?: string;
  position?: [number, number, number];
  scale?: number;
}

export default function LipstickModel({
  isNight = true,
  shade = "red",
  position = [0, 0, 0],
  scale = 1,
}: LipstickModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const bulletMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const shadeColor = SHADE_COLORS[shade] || SHADE_COLORS.red;

  // Animate bullet color change (both body and tip)
  useEffect(() => {
    const targetColor = new THREE.Color(shadeColor);
    if (bulletMatRef.current) {
      bulletMatRef.current.color.copy(targetColor);
      bulletMatRef.current.sheenColor = targetColor.clone().multiplyScalar(1.4);
      bulletMatRef.current.needsUpdate = true;
    }
    if (tipMatRef.current) {
      tipMatRef.current.color.copy(targetColor);
      tipMatRef.current.sheenColor = targetColor.clone().multiplyScalar(1.4);
      tipMatRef.current.needsUpdate = true;
    }
  }, [shadeColor]);

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 2.5,
      }),
    [accentColor]
  );

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: isNight ? "#0a0a0a" : "#f5f0e8",
        metalness: 0.6,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        reflectivity: 1,
        envMapIntensity: 1.8,
      }),
    [isNight]
  );

  const tipMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const bulletMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: shadeColor,
        metalness: 0.08,
        roughness: 0.2,
        clearcoat: 0.9,
        clearcoatRoughness: 0.08,
        sheen: 1,
        sheenColor: new THREE.Color(shadeColor).multiplyScalar(1.4),
        sheenRoughness: 0.25,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.03;
    }
    if (capRef.current) {
      capRef.current.rotation.y = t * 0.2;
      capRef.current.position.y = 1.4 + Math.sin(t * 0.6) * 0.08;
      capRef.current.position.x = 0.7 + Math.sin(t * 0.4) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.5;
      ringRef.current.rotation.z = t * 0.3;
    }

    // Smooth color interpolation for bullet body and tip
    const target = new THREE.Color(shadeColor);
    if (bulletMatRef.current) {
      bulletMatRef.current.color.lerp(target, 0.05);
    }
    if (tipMatRef.current) {
      tipMatRef.current.color.lerp(target, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0.1, 0, -0.05]}>
      {/* Main Body Tube */}
      <mesh material={bodyMaterial} position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.22, 1.3, 48]} />
      </mesh>

      {/* Gold Band - bottom accent */}
      <mesh material={goldMaterial} position={[0, -1.1, 0]} castShadow>
        <cylinderGeometry args={[0.225, 0.225, 0.06, 48]} />
      </mesh>

      {/* Gold Band - middle separator */}
      <mesh material={goldMaterial} position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.21, 0.04, 48]} />
      </mesh>

      {/* Upper mechanism */}
      <mesh material={bodyMaterial} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.5, 48]} />
      </mesh>

      {/* Gold collar at bullet base */}
      <mesh material={goldMaterial} position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.18, 0.05, 48]} />
      </mesh>

      {/* Lipstick Bullet - color changes with shade */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.17, 0.45, 48]} />
        <meshPhysicalMaterial
          ref={bulletMatRef}
          color={shadeColor}
          metalness={0.08}
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.08}
          sheen={1}
          sheenRoughness={0.25}
        />
      </mesh>

      {/* Bullet Tip - angled cut */}
      <mesh position={[0, 1.12, 0.02]} rotation={[0.12, 0, 0.15]} castShadow>
        <coneGeometry args={[0.16, 0.22, 48]} />
        <meshPhysicalMaterial
          ref={tipMatRef}
          color={shadeColor}
          metalness={0.08}
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.08}
          sheen={1}
          sheenRoughness={0.25}
        />
      </mesh>

      {/* Floating Cap */}
      <group ref={capRef} position={[0.7, 1.4, -0.2]} rotation={[0.4, 0.6, 0.15]}>
        <mesh material={bodyMaterial} castShadow>
          <cylinderGeometry args={[0.21, 0.2, 1.0, 48]} />
        </mesh>
        <mesh material={goldMaterial} position={[0, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.21, 0.05, 48]} />
        </mesh>
        <mesh material={bodyMaterial} position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.16, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>

      {/* Decorative floating ring */}
      <mesh ref={ringRef} material={goldMaterial} position={[-0.5, 0.1, 0.5]}>
        <torusGeometry args={[0.18, 0.012, 16, 48]} />
      </mesh>

      {/* Scattered accent spheres */}
      <mesh material={goldMaterial} position={[0.4, 0.6, 0.4]}>
        <sphereGeometry args={[0.025, 16, 16]} />
      </mesh>
      <mesh material={goldMaterial} position={[-0.3, 1.1, 0.3]}>
        <sphereGeometry args={[0.018, 16, 16]} />
      </mesh>
      <mesh material={goldMaterial} position={[0.2, -0.8, 0.35]}>
        <sphereGeometry args={[0.02, 16, 16]} />
      </mesh>
      <mesh material={goldMaterial} position={[-0.45, 0.7, -0.2]}>
        <sphereGeometry args={[0.015, 16, 16]} />
      </mesh>
    </group>
  );
}
