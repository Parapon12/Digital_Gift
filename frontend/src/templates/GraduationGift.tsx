import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, Text } from '@react-three/drei'
import type { Gift, OccasionContent } from '../types'

function Cap() {
  return (
    <Float speed={1.2} floatIntensity={0.45}>
      <group>
        <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 5, 0]}>
          <boxGeometry args={[1.4, 0.08, 1.4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.45, 0.5, 0.35, 24]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.55, 0.35, 0.55]}>
          <boxGeometry args={[0.05, 0.05, 0.9]} />
          <meshStandardMaterial color="#ffc93c" />
        </mesh>
        <Text position={[0, 1.1, 0]} fontSize={0.2} color="#ffc93c" anchorX="center">
          Congrats
        </Text>
      </group>
    </Float>
  )
}

export function GraduationGift({ gift }: { gift: Gift }) {
  const content = gift.content as OccasionContent
  return (
    <div className="tpl tpl-occasion">
      <div className="tpl-canvas compact">
        <Canvas camera={{ position: [0, 2.2, 4], fov: 45 }}>
          <color attach="background" args={['#160d05']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <Cap />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="tpl-panel">
        <p className="tpl-kicker">Graduation</p>
        <h1>{content.headline || 'ยินดีด้วยนะบัณฑิต'}</h1>
        <h2>{gift.recipient_name}</h2>
        <p>{content.message}</p>
        <p className="tpl-from">— {gift.sender_name}</p>
      </div>
    </div>
  )
}
