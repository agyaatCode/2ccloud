"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const UNITS = 15;
const UNIT_H = 0.235;
const Y0 = -1.7;

function Leds({ seed }: { seed: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = UNITS * 3;
  const tmp = useMemo(() => new THREE.Color(), []);
  const palette = useMemo(() => [new THREE.Color("#3e8fe0"), new THREE.Color("#3ddc97"), new THREE.Color("#3e8fe0"), new THREE.Color("#f2b50f")], []);
  const data = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ phase: rand(seed * 13 + i) * 6.28, speed: 0.5 + rand(seed * 7 + i * 3) * 2.2, c: palette[Math.floor(rand(seed + i * 5) * (i % 11 === 0 ? 4 : 3))] })),
    [count, seed, palette],
  );
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let u = 0; u < UNITS; u++)
      for (let j = 0; j < 3; j++) {
        o.position.set(0.3 + j * 0.07, Y0 + u * UNIT_H + 0.045, 0.505);
        o.updateMatrix();
        m.setMatrixAt(u * 3 + j, o.matrix);
        m.setColorAt(u * 3 + j, data[u * 3 + j].c);
      }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [data]);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const d = data[i];
      const k = 0.18 + 0.82 * Math.max(0, Math.sin(t * d.speed + d.phase) * 0.6 + 0.5);
      tmp.copy(d.c).multiplyScalar(k);
      m.setColorAt(i, tmp);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.035, 0.035, 0.02]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Rack({ x, seed }: { x: number; seed: number }) {
  const units = useMemo(() => Array.from({ length: UNITS }, (_, i) => i), []);
  return (
    <group position={[x, 0, 0]}>
      {[[-0.57, -0.5], [0.57, -0.5], [-0.57, 0.5], [0.57, 0.5]].map(([px, pz], i) => (
        <mesh key={i} position={[px, 0, pz]}>
          <boxGeometry args={[0.06, 3.95, 0.06]} />
          <meshStandardMaterial color="#0b1018" metalness={0.9} roughness={0.38} />
        </mesh>
      ))}
      {[-1.97, 1.97].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.2, 0.06, 1.1]} />
          <meshStandardMaterial color="#0e141d" metalness={0.85} roughness={0.4} />
        </mesh>
      ))}
      {units.map((u) => (
        <group key={u} position={[0, Y0 + u * UNIT_H, 0]}>
          <mesh>
            <boxGeometry args={[1.06, 0.2, 0.96]} />
            <meshStandardMaterial color="#1b2430" metalness={0.8} roughness={0.42} />
          </mesh>
          <mesh position={[0, 0, 0.49]}>
            <boxGeometry args={[1.04, 0.17, 0.02]} />
            <meshStandardMaterial color="#2c3948" metalness={0.75} roughness={0.32} />
          </mesh>
          {[0, 1, 2, 3, 4].map((j) => (
            <mesh key={j} position={[-0.4 + j * 0.15, 0, 0.503]}>
              <boxGeometry args={[0.12, 0.085, 0.01]} />
              <meshStandardMaterial color="#080b10" metalness={0.5} roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
      <Leds seed={seed} />
    </group>
  );
}

function Cable({ from, to, lift, delay }: { from: number; to: number; lift: number; delay: number }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(from, 1.99, 0.1), new THREE.Vector3(from + (to - from) * 0.25, 1.99 + lift, 0.25), new THREE.Vector3(from + (to - from) * 0.75, 1.99 + lift, 0.25), new THREE.Vector3(to, 1.99, 0.1)]),
    [from, to, lift],
  );
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 40, 0.017, 6, false), [curve]);
  const p1 = useRef<THREE.Mesh>(null);
  const p2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.22 + delay;
    p1.current?.position.copy(curve.getPoint(t % 1));
    p2.current?.position.copy(curve.getPoint((t + 0.5) % 1));
  });
  return (
    <>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#1f5ea8" metalness={0.2} roughness={0.5} />
      </mesh>
      {[p1, p2].map((r, i) => (
        <mesh key={i} ref={r}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshBasicMaterial color="#3ddc97" toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function World() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.rotation.y = -0.38 + Math.sin(t * 0.22) * 0.2 + pointer.x * 0.12;
    g.current.rotation.x = pointer.y * -0.03;
  });
  return (
    <group ref={g} position={[0, 0, 0]}>
      <Rack x={-1.45} seed={1} />
      <Rack x={0} seed={2} />
      <Rack x={1.45} seed={3} />
      <Cable from={-1.45} to={0} lift={0.45} delay={0} />
      <Cable from={0} to={1.45} lift={0.55} delay={0.35} />
      <Cable from={-1.45} to={1.45} lift={0.95} delay={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#071a36" metalness={0.55} roughness={0.38} />
      </mesh>
    </group>
  );
}

export default function Rack3DScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0.4, 0.55, 8.4], fov: 31 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-label="3D model of a server rack with network cabling"
    >
      <fog attach="fog" args={["#061429", 9, 20]} />
      <hemisphereLight args={["#a9ccf5", "#06142b", 0.6]} />
      <directionalLight position={[4, 6, 5]} intensity={1.7} color="#e3edff" />
      <pointLight position={[-4, 1.2, 4]} intensity={22} color="#3e8fe0" distance={14} />
      <pointLight position={[3, 2.5, -3]} intensity={14} color="#1f73c8" distance={12} />
      <World />
    </Canvas>
  );
}
