import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'
import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Sky,
  Sparkles,
  useTexture,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { FINALE_X, PATH_START, STORY_STOPS, WALK_SPEED } from './constants'
import { QUALITY, adventureQuality, type AdventureQuality } from './quality'
import { asset } from '../../lib/asset'

export type AdventureWorldMode =
  | 'intro'
  | 'zoom'
  | 'meadow'
  | 'walk'
  | 'story'
  | 'finale'
  | 'ending'

export interface AdventureSceneProps {
  mode: AdventureWorldMode
  storyIndex: number
  walkTarget: number
  storyStops?: number[]
  memoryCount?: number
  onCatClick?: () => void
  catInteractive?: boolean
  /** Fires once when the couple reaches walkTarget while walking */
  onArrive?: () => void
}

/** World Y of the meadow under the walking lane (z ≈ 1.15) */
function terrainHeightAt(worldX: number, worldZ = 1.15) {
  const lx = worldX - 12
  const ly = -worldZ
  const raw =
    Math.sin(lx * 0.18) * 0.18 +
    Math.cos(ly * 0.25) * 0.12 +
    Math.sin(lx * 0.05 + ly * 0.08) * 0.35
  const along = Math.abs(worldZ - 1.15)
  const flatten = Math.max(0, 1 - along / 1.85)
  // Path corridor is nearly flat so feet never sink into hills
  return raw * (1 - flatten * 0.98)
}

function Terrain({ segments = [48, 24] as [number, number] }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(70, 28, segments[0], segments[1])
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const worldX = x + 12
      const worldZ = -y
      pos.setZ(i, terrainHeightAt(worldX, worldZ))
    }
    g.computeVertexNormals()
    return g
  }, [segments[0], segments[1]])

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[12, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#5a9e4b" roughness={0.92} metalness={0.02} />
    </mesh>
  )
}

function Water() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.02, 3.8]} receiveShadow>
      <planeGeometry args={[28, 6]} />
      <meshStandardMaterial
        color="#7dd3c7"
        roughness={0.15}
        metalness={0.35}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function FlowerField({ count = 42 }: { count?: number }) {
  const stemRef = useRef<THREE.InstancedMesh>(null)
  const headRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!stemRef.current || !headRef.current) return
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const palette = ['#fda4af', '#fff1f2', '#fb7185', '#fecdd3', '#f9a8d4']

    for (let i = 0; i < count; i++) {
      const x = -2 + ((i * 19) % 270) / 10
      let z = -4 + ((i * 11) % 80) / 10
      if (z > 2.1 && z < 5.1) z += 3.2
      const s = 0.8 + (i % 5) * 0.08

      dummy.position.set(x, 0.28 * s, z)
      dummy.scale.set(s, s, s)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      stemRef.current.setMatrixAt(i, dummy.matrix)

      dummy.position.set(x, 0.56 * s, z)
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      headRef.current.setMatrixAt(i, dummy.matrix)
      color.set(palette[i % palette.length])
      headRef.current.setColorAt(i, color)
    }

    stemRef.current.instanceMatrix.needsUpdate = true
    headRef.current.instanceMatrix.needsUpdate = true
    if (headRef.current.instanceColor) {
      headRef.current.instanceColor.needsUpdate = true
    }
  }, [count])

  return (
    <group>
      <instancedMesh ref={stemRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.016, 0.022, 0.55, 5]} />
        <meshStandardMaterial color="#3f8f46" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial roughness={0.55} />
      </instancedMesh>
    </group>
  )
}

function WoodenBridge() {
  // Deck top ≈ y 0.22 so couple can step up without feet clipping
  return (
    <group position={[10, 0.02, 1.15]}>
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[3.8, 0.12, 1.55]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.85} />
      </mesh>
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.05, 1.5]} />
          <meshStandardMaterial color="#a16207" roughness={0.8} />
        </mesh>
      ))}
      {[
        [-1.8, 0.72],
        [1.8, 0.72],
        [-1.8, -0.72],
        [1.8, -0.72],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.48, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.9, 8]} />
          <meshStandardMaterial color="#713f12" />
        </mesh>
      ))}
      <mesh position={[0, 0.88, 0.72]} castShadow>
        <boxGeometry args={[3.6, 0.05, 0.06]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 0.88, -0.72]} castShadow>
        <boxGeometry args={[3.6, 0.05, 0.06]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  )
}

/** Smooth height so feet rest on bridge deck (~x 8.2–11.8) */
function bridgeHeight(x: number) {
  const center = 10
  const half = 2.05
  const d = Math.abs(x - center)
  if (d >= half) return 0
  const t = 1 - d / half
  const s = t * t * (3 - 2 * t)
  return 0.2 * s
}

const FOOT_CLEARANCE = 0.04

function Hill() {
  // Backdrop only — kept behind the walking path so the couple never clips into it
  return (
    <mesh position={[18.8, -1.35, -5.2]} castShadow receiveShadow>
      <sphereGeometry args={[4.2, 32, 24]} />
      <meshStandardMaterial color="#4d8f45" roughness={0.95} />
    </mesh>
  )
}

function LollipopTree({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number]
  color: string
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.055, 1.7, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.55, 20, 20]} />
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, 1.85, 0.02]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color="#fff7fb" roughness={0.4} transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

function LollipopGrove({ compact = false }: { compact?: boolean }) {
  const trees: Array<{ position: [number, number, number]; color: string; scale: number }> = [
    { position: [2.2, 0, -3.4], color: '#f9a8d4', scale: 1.05 },
    { position: [5.5, 0, -4.2], color: '#ffffff', scale: 0.85 },
    { position: [8.8, 0, -3.6], color: '#fda4af', scale: 1.15 },
    { position: [12.4, 0, -4.5], color: '#fbcfe8', scale: 0.95 },
    { position: [15.6, 0, -3.2], color: '#ffffff', scale: 1.1 },
    { position: [19.2, 0, -4.8], color: '#f9a8d4', scale: 1.25 },
    { position: [0.4, 0, -2.6], color: '#fecdd3', scale: 0.7 },
    { position: [22.5, 0, -3.8], color: '#ffffff', scale: 0.9 },
  ]
  const list = compact ? trees.filter((_, i) => i % 2 === 0) : trees
  return (
    <group>
      {list.map((t, i) => (
        <LollipopTree key={i} {...t} />
      ))}
    </group>
  )
}

function GiftBoxProp() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = 2.55 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12
  })

  return (
    <group ref={ref} position={[19.4, 2.55, -4.6]} scale={0.85}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.55, 0.7]} />
        <meshStandardMaterial color="#fb7185" roughness={0.45} emissive="#fb7185" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.78, 0.14, 0.78]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.14, 0.58, 0.72]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.72, 0.58, 0.14]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 0.6, 0.4]} intensity={0.55} distance={3.5} color="#fda4af" />
    </group>
  )
}

function AmbientHearts({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = Math.random() * 26
      positions[i * 3 + 1] = 0.4 + Math.random() * 4.5
      positions[i * 3 + 2] = -5 + Math.random() * 8
      speeds[i] = 0.12 + Math.random() * 0.28
    }
    return { positions, speeds }
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += data.speeds[i] * delta
      pos[i * 3] += Math.sin(i + pos[i * 3 + 1]) * delta * 0.08
      if (pos[i * 3 + 1] > 5.2) {
        pos[i * 3 + 1] = 0.3
        pos[i * 3] = Math.random() * 26
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#fb7185"
        size={0.14}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function LoveCrystal() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.9
    ref.current.position.y = 0.95 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08
  })
  return (
    <group>
      <mesh ref={ref} position={[0, 0.95, 0]} castShadow>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fbbf24"
          emissiveIntensity={0.85}
          roughness={0.2}
          metalness={0.35}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.32, 0.42, 32]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fbbf24"
          emissiveIntensity={0.65}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight position={[0, 1.1, 0.2]} intensity={0.7} distance={2.8} color="#fde68a" />
    </group>
  )
}

function Butterfly({ offset, radius }: { offset: number; radius: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + offset
    ref.current.position.set(
      6 + Math.cos(t * 0.55) * radius,
      1.3 + Math.sin(t * 1.3) * 0.45,
      Math.sin(t * 0.55) * radius * 0.35,
    )
    ref.current.rotation.y = -t * 0.55 + Math.PI / 2
    const flap = Math.sin(t * 16) * 0.7
    ;(ref.current.children[0] as THREE.Mesh).rotation.y = flap
    ;(ref.current.children[1] as THREE.Mesh).rotation.y = -flap
  })

  return (
    <group ref={ref}>
      <mesh position={[-0.07, 0, 0]}>
        <planeGeometry args={[0.22, 0.16]} />
        <meshStandardMaterial
          color="#fbcfe8"
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
          emissive="#fda4af"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0.07, 0, 0]}>
        <planeGeometry args={[0.22, 0.16]} />
        <meshStandardMaterial color="#fb7185" side={THREE.DoubleSide} transparent opacity={0.92} />
      </mesh>
    </group>
  )
}

function ChibiPerson({
  outfit,
  hair,
  side,
  walking,
}: {
  outfit: string
  hair: string
  side: 'left' | 'right'
  walking: boolean
}) {
  const root = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const walkAmt = useRef(0)

  useFrame((state, delta) => {
    if (!root.current) return
    const t = state.clock.elapsedTime
    walkAmt.current = THREE.MathUtils.damp(walkAmt.current, walking ? 1 : 0, 7, delta)
    const a = walkAmt.current
    const s = Math.sin(t * 8.2) * a

    if (leftLeg.current) leftLeg.current.rotation.x = s * 0.32
    if (rightLeg.current) rightLeg.current.rotation.x = -s * 0.32
    if (leftArm.current) leftArm.current.rotation.x = -s * 0.28
    if (rightArm.current) rightArm.current.rotation.x = s * 0.28

    // Only bob upward so soles never push below ground
    const bob = Math.abs(Math.sin(t * 8.2)) * 0.03 * a + Math.max(0, Math.sin(t * 2)) * 0.008 * (1 - a)
    root.current.position.y = bob
  })

  const x = side === 'left' ? -0.42 : 0.42

  return (
    <group ref={root} position={[x, 0, 0]}>
      <mesh position={[0, 1.12, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#ffd7b5" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.29, -0.02]} castShadow>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.12, -0.16]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      <mesh position={[-0.09, 1.15, 0.24]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.09, 1.15, 0.24]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.08, 1.165, 0.275]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.1, 1.165, 0.275]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.16, 1.07, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#fda4af" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.16, 1.07, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#fda4af" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.28, 6, 12]} />
        <meshStandardMaterial color={outfit} roughness={0.6} />
      </mesh>
      <group ref={leftArm} position={[-0.3, 0.7, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.18, 4, 8]} />
          <meshStandardMaterial color={outfit} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.3, 0.7, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.18, 4, 8]} />
          <meshStandardMaterial color={outfit} />
        </mesh>
      </group>
      {/* Hip at 0.28; capsule bottom lands at y≈0 */}
      <group ref={leftLeg} position={[-0.1, 0.28, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.14, 4, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.1, 0.28, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.14, 4, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  )
}

function Couple({
  x,
  walking,
  visible,
  showCrystal,
  followX,
  onArrive,
}: {
  x: number
  walking: boolean
  visible: boolean
  showCrystal?: boolean
  followX: MutableRefObject<number>
  onArrive?: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const arrivedFor = useRef<number | null>(null)
  const onArriveRef = useRef(onArrive)
  const heightY = useRef(0)
  onArriveRef.current = onArrive

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.visible = visible

    const cur = group.current.position.x
    const dist = x - cur
    const abs = Math.abs(dist)

    if (abs < 0.035) {
      group.current.position.x = x
      if (walking && arrivedFor.current !== x) {
        arrivedFor.current = x
        onArriveRef.current?.()
      }
    } else {
      if (arrivedFor.current === x) arrivedFor.current = null
      const speed = walking ? WALK_SPEED : WALK_SPEED * 0.55
      const step = Math.min(abs, speed * delta)
      group.current.position.x = cur + Math.sign(dist) * step
    }

    const px = group.current.position.x
    const targetY = terrainHeightAt(px, 1.15) + bridgeHeight(px) + FOOT_CLEARANCE
    heightY.current = THREE.MathUtils.damp(heightY.current, targetY, 10, delta)
    group.current.position.y = heightY.current
    followX.current = px
  })

  return (
    <group ref={group} position={[PATH_START, 0, 1.15]}>
      <ChibiPerson outfit="#60a5fa" hair="#1e3a5f" side="left" walking={walking} />
      <ChibiPerson outfit="#f472b6" hair="#7c2d12" side="right" walking={walking} />
      {showCrystal ? <LoveCrystal /> : null}
    </group>
  )
}

function FloatingHearts3D({ active, count = 28 }: { active: boolean; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3
      positions[i * 3 + 1] = Math.random() * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5
      speeds[i] = 0.25 + Math.random() * 0.55
    }
    return { positions, speeds }
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current || !active) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += data.speeds[i] * delta
      if (pos[i * 3 + 1] > 3.5) {
        pos[i * 3 + 1] = 0
        pos[i * 3] = (Math.random() - 0.5) * 3
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={ref} position={[FINALE_X, 1, 1.15]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#fb7185"
        size={0.16}
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CalicoCat({
  interactive,
  onClick,
  offer,
}: {
  interactive?: boolean
  onClick?: () => void
  offer?: boolean
}) {
  const texture = useTexture(asset('love/mochi-cat.png'))
  const group = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const pedestalTop = 0.58
  // Plane height 1.55 — bottom of sprite sits on pedestal
  const planeH = 1.7
  const planeW = planeH * (920 / 1289)
  const baseY = pedestalTop + planeH / 2

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true
  }, [texture])

  useFrame((_, delta) => {
    if (!group.current) return
    // Face camera (billboard yaw only)
    const dx = camera.position.x - group.current.position.x
    const dz = camera.position.z - group.current.position.z
    const targetYaw = Math.atan2(dx, dz)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetYaw, 8, delta)

    const targetZ = offer ? 1.45 : 1.15
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 4, delta)
    // Keep planted — tiny bob only above the seat
    group.current.position.y = baseY + Math.sin(_.clock.elapsedTime * 1.5) * 0.012
  })

  return (
    <group
      ref={group}
      position={[FINALE_X, baseY, 1.15]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        if (interactive && onClick) onClick()
      }}
      onPointerOver={() => {
        if (interactive) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.35}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0.4, 0.4]} intensity={0.35} distance={3} color="#ffe4e6" />
    </group>
  )
}

function StonePedestal() {
  return (
    <group position={[FINALE_X, 0, 1.15]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.68, 0.5, 12]} />
        <meshStandardMaterial color="#8a8178" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.1, 12]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.85} />
      </mesh>
      {/* soft seat disc so paws never sink visually */}
      <mesh position={[0, 0.575, 0]} receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
        <meshStandardMaterial color="#b5aea6" roughness={0.88} />
      </mesh>
    </group>
  )
}

function PetalRain({ active, count = 28 }: { active: boolean; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = Math.random() * 26
      arr[i * 3 + 1] = 1.5 + Math.random() * 4
      arr[i * 3 + 2] = (Math.random() - 0.5) * 7
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current || !active) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= delta * (0.35 + (i % 5) * 0.08)
      pos[i * 3] += Math.sin(i + pos[i * 3 + 1]) * delta * 0.25
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 4.5
        pos[i * 3] = Math.random() * 26
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fda4af" size={0.11} transparent opacity={0.75} depthWrite={false} />
    </points>
  )
}

function StoryMarker({
  x,
  active,
  visited,
  index,
}: {
  x: number
  active: boolean
  visited: boolean
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const pulse = active ? 0.12 + Math.sin(state.clock.elapsedTime * 3) * 0.04 : 0
    ref.current.position.y = 0.55 + pulse
    ref.current.rotation.y = state.clock.elapsedTime * (active ? 0.8 : 0.2)
  })

  const color = active ? '#ffc93c' : visited ? '#fb7185' : '#fff1f2'
  const z = index % 2 === 0 ? 0.35 : 1.95

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.38, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.55 : visited ? 0.25 : 0.08}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={ref} castShadow>
        <octahedronGeometry args={[active ? 0.18 : 0.12, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.7 : 0.2}
          roughness={0.3}
          metalness={0.25}
        />
      </mesh>
    </group>
  )
}

function PathRibbon({ stops }: { stops: number[] }) {
  const points = useMemo(() => {
    const xs = [PATH_START, ...stops, FINALE_X]
    return xs.map((x) => new THREE.Vector3(x, 0.04, 1.15))
  }, [stops])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.045, 6, false), [curve])

  return (
    <mesh geometry={tube}>
      <meshStandardMaterial
        color="#fde68a"
        emissive="#fbbf24"
        emissiveIntensity={0.15}
        transparent
        opacity={0.35}
        roughness={0.6}
      />
    </mesh>
  )
}

function CameraRig({
  mode,
  followX,
}: {
  mode: AdventureWorldMode
  followX: MutableRefObject<number>
}) {
  const { size } = useThree()
  const zoomProgress = useRef(0)
  const lookTarget = useRef(new THREE.Vector3(PATH_START, 0.95, 1.15))
  const lookSmooth = useRef(new THREE.Vector3(PATH_START, 0.95, 1.15))
  const desired = useRef(new THREE.Vector3(1.35, 1.65, 6.8))
  const focusLag = useRef(PATH_START)

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera
    const isPhone = size.width < 768
    const isTablet = size.width >= 768 && size.width < 1100
    const isPortrait = size.height >= size.width
    const phonePortrait = isPhone && isPortrait
    const dt = Math.min(delta, 0.05)

    // Phone portrait: wider FOV + pull back so couple sits in the upper safe zone above the card
    const targetFov = phonePortrait ? 56 : isPhone ? 46 : isTablet ? 40 : 36
    cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, dt)
    cam.updateProjectionMatrix()

    const zMul = phonePortrait ? 1.72 : isPhone ? 1.28 : isTablet ? 1.12 : 1
    // Higher cam + look slightly below couple → characters shift up in frame (clear of bottom UI)
    const camY = phonePortrait ? 2.55 : isPhone ? 1.95 : isTablet ? 1.7 : 1.55
    const lookY = phonePortrait ? 0.42 : isPhone ? 0.75 : 0.95
    const subject = followX.current

    focusLag.current = THREE.MathUtils.damp(focusLag.current, subject, 5.5, dt)
    const focus = focusLag.current

    if (mode === 'intro') {
      desired.current.set(PATH_START + (phonePortrait ? 0 : 0.2), camY, 6.8 * zMul)
      lookTarget.current.set(PATH_START, lookY, 1.15)
      zoomProgress.current = 0
    } else if (mode === 'zoom') {
      zoomProgress.current = Math.min(1, zoomProgress.current + dt * 0.7)
      const p = zoomProgress.current
      desired.current.set(
        PATH_START + (phonePortrait ? 0 : 0.25) + p * 0.1,
        camY - p * 0.08,
        (6.7 - p * 0.2) * zMul,
      )
      lookTarget.current.set(PATH_START + p * 0.08, lookY, 1.15)
    } else if (mode === 'finale' || mode === 'ending') {
      desired.current.set(
        FINALE_X - (phonePortrait ? 0.05 : isPhone ? 0.2 : 0.35),
        camY + 0.1,
        5.9 * zMul,
      )
      lookTarget.current.set(FINALE_X - (phonePortrait ? 0.2 : 0.4), lookY + 0.15, 1.15)
    } else {
      // Keep couple centered on phone; desktop keeps right-card bias
      const sideBias = phonePortrait ? 0 : isPhone ? 0.2 : isTablet ? 0.45 : 0.7
      const back = (mode === 'story' ? 6.6 : 6.1) * zMul
      desired.current.set(focus + sideBias, camY, back)
      lookTarget.current.set(focus - (phonePortrait ? 0 : isPhone ? 0.05 : 0.18), lookY, 1.15)
    }

    const damp = mode === 'walk' || mode === 'zoom' ? 4.2 : 3.4
    cam.position.x = THREE.MathUtils.damp(cam.position.x, desired.current.x, damp, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, desired.current.y, damp, dt)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, desired.current.z, damp, dt)
    lookSmooth.current.x = THREE.MathUtils.damp(lookSmooth.current.x, lookTarget.current.x, damp, dt)
    lookSmooth.current.y = THREE.MathUtils.damp(lookSmooth.current.y, lookTarget.current.y, damp, dt)
    lookSmooth.current.z = THREE.MathUtils.damp(lookSmooth.current.z, lookTarget.current.z, damp, dt)
    cam.lookAt(lookSmooth.current)
  })

  return null
}

function World({
  mode,
  storyIndex,
  walkTarget,
  storyStops = STORY_STOPS,
  memoryCount = 4,
  onCatClick,
  catInteractive,
  onArrive,
}: AdventureSceneProps) {
  const { size } = useThree()
  const q = QUALITY[adventureQuality(size.width, size.height)]
  const followX = useRef(PATH_START)
  const progress = memoryCount <= 1 ? 1 : storyIndex / (memoryCount - 1)
  const showFinaleProps = mode === 'finale' || mode === 'ending' || progress >= 0.75
  const catOffer = mode === 'ending'
  const sunPos: [number, number, number] = [9, 1.15, -9]
  const coupleX =
    mode === 'intro' || mode === 'zoom'
      ? PATH_START
      : mode === 'finale' || mode === 'ending'
        ? FINALE_X - 2.1
        : walkTarget

  return (
    <>
      <ambientLight intensity={0.52} color="#ffd6e7" />
      <directionalLight
        castShadow={q.shadows}
        position={sunPos}
        intensity={1.25}
        color="#fdba74"
        shadow-mapSize={[q.shadowMap, q.shadowMap]}
        shadow-camera-far={35}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-6}
      />
      <hemisphereLight intensity={0.42} color="#fbcfe8" groundColor="#3f7a3a" />
      <pointLight position={[14, 2.2, -2]} intensity={0.35} distance={18} color="#fda4af" />

      <Sky
        distance={450000}
        sunPosition={sunPos}
        inclination={0.46}
        azimuth={0.32}
        mieCoefficient={0.008}
        mieDirectionalG={0.85}
        rayleigh={2}
        turbidity={8}
      />

      <Terrain segments={[q.terrainSegX, q.terrainSegY]} />
      <Water />
      <FlowerField count={q.flowerCount} />
      <WoodenBridge />
      <Hill />
      <LollipopGrove compact={!q.butterflies} />
      <GiftBoxProp />
      <AmbientHearts count={q.hearts} />
      <PathRibbon stops={storyStops} />

      {storyStops.map((x, i) => (
        <StoryMarker
          key={`${x}-${i}`}
          x={x}
          index={i}
          active={(mode === 'story' && storyIndex === i) || (mode === 'intro' && i === 0)}
          visited={storyIndex > i || mode === 'finale' || mode === 'ending'}
        />
      ))}

      {q.butterflies && (
        <>
          <Butterfly offset={0} radius={3.2} />
          <Butterfly offset={2.2} radius={4.2} />
        </>
      )}

      <Couple
        x={coupleX}
        walking={mode === 'walk'}
        visible
        showCrystal={
          mode === 'intro' ||
          mode === 'story' ||
          (mode !== 'walk' && mode !== 'zoom' && mode !== 'finale' && mode !== 'ending')
        }
        followX={followX}
        onArrive={mode === 'walk' ? onArrive : undefined}
      />

      {showFinaleProps && (
        <>
          <StonePedestal />
          {(mode === 'finale' || mode === 'ending') && (
            <>
              <Suspense fallback={null}>
                <CalicoCat interactive={catInteractive} onClick={onCatClick} offer={catOffer} />
              </Suspense>
              <FloatingHearts3D active count={Math.min(q.hearts, 20)} />
              <Sparkles
                count={q.finaleSparkles}
                scale={[4, 3, 2.5]}
                position={[FINALE_X, 1.5, 1.15]}
                size={3}
                speed={0.3}
                color="#fde68a"
              />
            </>
          )}
        </>
      )}

      <PetalRain active={mode !== 'ending'} count={q.petals} />
      <Sparkles
        count={q.sparkles}
        scale={[18, 6, 6]}
        position={[10, 2.2, 0]}
        size={2.4}
        speed={0.2}
        color="#fecdd3"
        opacity={0.65}
      />

      {q.contactShadows && (
        <ContactShadows position={[0, 0.02, 0]} opacity={0.38} scale={36} blur={2.2} far={8} frames={1} />
      )}

      <CameraRig mode={mode} followX={followX} />

      {q.bloom && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom luminanceThreshold={0.88} luminanceSmoothing={0.45} intensity={0.28} />
        </EffectComposer>
      )}
    </>
  )
}

function AdaptiveCanvas({ children }: { children: ReactNode }) {
  // Lock quality at first paint — flipping shadows/dpr remounts WebGL and can blank phones
  const [tier] = useState<AdventureQuality>(() =>
    typeof window !== 'undefined'
      ? adventureQuality(window.innerWidth, window.innerHeight)
      : 'low',
  )
  const q = QUALITY[tier]
  const isTouch =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  return (
    <Canvas
      className="adventure-canvas"
      shadows={q.shadows}
      camera={{ position: [1.35, 1.65, 6.8], fov: 42, near: 0.1, far: 80 }}
      gl={{
        antialias: tier === 'high',
        alpha: true,
        powerPreference: isTouch ? 'default' : 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        stencil: false,
        depth: true,
      }}
      dpr={[1, q.dprMax]}
      style={{ background: 'transparent', touchAction: 'none' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMappingExposure = 1.02
        gl.domElement.addEventListener(
          'webglcontextlost',
          (e) => {
            e.preventDefault()
          },
          false,
        )
      }}
    >
      {children}
    </Canvas>
  )
}

export default function AdventureScene(props: AdventureSceneProps) {
  return (
    <AdaptiveCanvas>
      <Suspense fallback={null}>
        <World {...props} />
      </Suspense>
    </AdaptiveCanvas>
  )
}
