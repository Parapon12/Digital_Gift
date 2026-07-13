import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, Text } from '@react-three/drei'
import type { Gift, OccasionContent } from '../types'

function Ring() {
  return (
    <Float speed={1.6} floatIntensity={0.5}>
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.08, 16, 48]} />
          <meshStandardMaterial color="#ffc93c" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#e8f6ff" metalness={0.4} roughness={0.1} />
        </mesh>
        <Text position={[0, 1.15, 0]} fontSize={0.2} color="#ffc93c" anchorX="center">
          Will you?
        </Text>
      </group>
    </Float>
  )
}

export function ProposalGift({ gift }: { gift: Gift }) {
  const content = gift.content as OccasionContent
  return (
    <div className="tpl tpl-occasion">
      <div className="tpl-canvas compact">
        <Canvas camera={{ position: [0, 2.2, 4], fov: 45 }}>
          <color attach="background" args={['#160d05']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <Ring />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="tpl-panel">
        <p className="tpl-kicker">Proposal</p>
        <h1>{content.headline || 'แต่งงานกับฉันนะ'}</h1>
        <h2>{gift.recipient_name}</h2>
        <p>{content.message}</p>
        <p className="tpl-from">— {gift.sender_name}</p>
      </div>
    </div>
  )
}
