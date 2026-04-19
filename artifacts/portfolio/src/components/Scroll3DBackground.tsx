import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

/* ─── Helpers ───────────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* ─── Main knot: rotates + drifts across screen on scroll ───── */

function TorusKnotMesh({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const s = scrollProgress.get();
    const t = clock.getElapsedTime();

    meshRef.current.rotation.y = s * Math.PI * 5 + t * 0.07;
    meshRef.current.rotation.x = s * Math.PI * 2 + t * 0.035;
    meshRef.current.rotation.z = t * 0.018;

    const scale = 1 + Math.sin(s * Math.PI) * 0.32;
    meshRef.current.scale.setScalar(scale);

    meshRef.current.position.x = lerp(2.6, -2.6, s);
    meshRef.current.position.y = lerp(0.9, -0.9, s);
    meshRef.current.position.z = lerp(0, -0.8, s);
  });

  return (
    <mesh ref={meshRef} position={[2.6, 0.9, 0]}>
      <torusKnotGeometry args={[1, 0.33, 180, 18, 2, 3]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#4c1d95"
        emissiveIntensity={1.8}
        wireframe
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

/* ─── Secondary accent ring ─────────────────────────────────── */

function AccentRing({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const s = scrollProgress.get();
    const t = clock.getElapsedTime();

    meshRef.current.rotation.x = t * 0.055 + s * Math.PI * 1.5;
    meshRef.current.rotation.y = t * 0.04 + s * Math.PI;

    meshRef.current.position.x = lerp(-3, 3, s);
    meshRef.current.position.y = lerp(-1, 1, s);

    const scale = 0.7 + Math.sin(s * Math.PI * 2) * 0.25;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={[-3, -1, -2]}>
      <torusGeometry args={[0.9, 0.04, 12, 80]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#064e3b"
        emissiveIntensity={2}
        transparent
        opacity={0.65}
      />
    </mesh>
  );
}

/* ─── Particle cloud ────────────────────────────────────────── */

function ParticleCloud({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 6.5;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const s = scrollProgress.get();
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.035 + s * Math.PI * 0.8;
    pointsRef.current.rotation.x = t * 0.018 + s * 0.4;
    const scale = 1 + s * 0.18;
    pointsRef.current.scale.setScalar(scale);
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.022}
        color="#a78bfa"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Floating icosahedron (top-left counter-motion) ─────────── */

function FloatingIco({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const s = scrollProgress.get();
    const t = clock.getElapsedTime();

    meshRef.current.rotation.x = t * 0.06 - s * Math.PI * 1.2;
    meshRef.current.rotation.y = t * 0.09 - s * Math.PI * 0.8;

    meshRef.current.position.x = lerp(-3.5, 2.5, s);
    meshRef.current.position.y = lerp(2.2, -2.2, s);

    const scale = 0.5 + Math.cos(s * Math.PI) * 0.18;
    meshRef.current.scale.setScalar(Math.max(0.2, scale));
  });

  return (
    <mesh ref={meshRef} position={[-3.5, 2.2, -3]}>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial
        color="#6366f1"
        emissive="#3730a3"
        emissiveIntensity={1.5}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/* ─── Scene wrapper ─────────────────────────────────────────── */

function Scene({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[-5, 4, 3]}  color="#7c3aed" intensity={18} />
      <pointLight position={[5, -3, -1]} color="#10b981" intensity={12} />
      <pointLight position={[0, 0, 5]}   color="#6366f1" intensity={8}  />
      <TorusKnotMesh scrollProgress={scrollProgress} />
      <AccentRing    scrollProgress={scrollProgress} />
      <FloatingIco   scrollProgress={scrollProgress} />
      <ParticleCloud scrollProgress={scrollProgress} />
    </>
  );
}

/* ─── Root export ────────────────────────────────────────────── */

export default function Scroll3DBackground() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.5], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene scrollProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
