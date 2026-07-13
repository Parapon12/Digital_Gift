import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, Text } from '@react-three/drei'
import type { Gift, OccasionContent } from '../types'

function Cake() {
  return (
    <Float speed={1.4} floatIntensity={0.35}>
      <group>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1, 0.5, 32]} />
          <meshStandardMaterial color="#f2d4a8" />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.7, 0.35, 32]} />
          <meshStandardMaterial color="#e85d75" />
        </mesh>
        {[ -0.25, 0, 0.25 ].map((x) => (
          <mesh key={x} position={[x, 0.9, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
            <meshStandardMaterial color="#fff3d6" />
          </mesh>
        ))}
        <Text position={[0, 1.35, 0]} fontSize={0.22} color="#ffc93c" anchorX="center">
          Happy Birthday
        </Text>
      </group>
    </Float>
  )
}

export function BirthdayGift({ gift }: { gift: Gift }) {
  const content = gift.content as OccasionContent
  return (
    <div className="tpl tpl-occasion">
      <div className="tpl-canvas compact">
        <Canvas camera={{ position: [0, 2.2, 4], fov: 45 }}>
          <color attach="background" args={['#160d05']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <Cake />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="tpl-panel">
        <p className="tpl-kicker">Birthday</p>
        <h1>{content.headline || 'สุขสันต์วันเกิด'}</h1>
        <h2>{gift.recipient_name}</h2>
        <p>{content.message}</p>
        <p className="tpl-from">— {gift.sender_name}</p>
      </div>
    </div>
  )
}
