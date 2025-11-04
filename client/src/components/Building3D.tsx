import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Building } from './Building';

export const Building3D = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-50">
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#e0f2fe']} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />

        {/* Environment */}
        <Environment preset="sunset" />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#7cb342" />
        </mesh>

        {/* Contact Shadows */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={30}
          blur={2}
          far={10}
        />

        {/* The Building */}
        <Building />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
};
