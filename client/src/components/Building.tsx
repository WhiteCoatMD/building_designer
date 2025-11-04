import { useRef } from 'react';
import { useBuildingStore } from '../store/buildingStore';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const Building = () => {
  const groupRef = useRef<THREE.Group>(null);
  const {
    width,
    depth,
    wallHeight,
    roofStyle,
    doors,
    windows,
    doorWidth,
    wallColor,
    roofColor,
    trimColor,
    doorColor,
  } = useBuildingStore();

  // Convert feet to 3D units (1 foot = 0.5 units for better visualization)
  const w = width * 0.5;
  const d = depth * 0.5;
  const h = wallHeight * 0.5;

  // Roof height based on style
  const roofHeight = roofStyle === 'gambrel' ? h * 0.8 : h * 0.6;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Floor */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[w, 0.2, d]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Walls */}
      {/* Front Wall */}
      <mesh position={[0, h / 2, d / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, h / 2, -d / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-w / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, h, d]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[w / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, h, d]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Trim - Top */}
      <mesh position={[0, h, d / 2 + 0.15]} castShadow>
        <boxGeometry args={[w + 0.4, 0.3, 0.3]} />
        <meshStandardMaterial color={trimColor} />
      </mesh>
      <mesh position={[0, h, -d / 2 - 0.15]} castShadow>
        <boxGeometry args={[w + 0.4, 0.3, 0.3]} />
        <meshStandardMaterial color={trimColor} />
      </mesh>

      {/* Roof - Gambrel Style */}
      {roofStyle === 'gambrel' && (
        <>
          {/* Lower roof sections - steeper angle */}
          <mesh
            position={[-w / 4, h + roofHeight * 0.3, 0]}
            rotation={[0, 0, Math.PI / 6]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 0.5, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
          <mesh
            position={[w / 4, h + roofHeight * 0.3, 0]}
            rotation={[0, 0, -Math.PI / 6]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 0.5, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>

          {/* Upper roof sections - shallower angle */}
          <mesh
            position={[-w / 8, h + roofHeight * 0.7, 0]}
            rotation={[0, 0, Math.PI / 9]}
            castShadow
          >
            <boxGeometry args={[w / 4 + 0.3, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
          <mesh
            position={[w / 8, h + roofHeight * 0.7, 0]}
            rotation={[0, 0, -Math.PI / 9]}
            castShadow
          >
            <boxGeometry args={[w / 4 + 0.3, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
        </>
      )}

      {/* Roof - Gable Style */}
      {roofStyle === 'gable' && (
        <>
          <mesh
            position={[-w / 4, h + roofHeight / 2, 0]}
            rotation={[0, 0, Math.PI / 6]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 1, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
          <mesh
            position={[w / 4, h + roofHeight / 2, 0]}
            rotation={[0, 0, -Math.PI / 6]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 1, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
        </>
      )}

      {/* Roof - A-Frame Style */}
      {roofStyle === 'a-frame' && (
        <>
          <mesh
            position={[-w / 4, h + roofHeight / 2, 0]}
            rotation={[0, 0, Math.PI / 4]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 1.5, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
          <mesh
            position={[w / 4, h + roofHeight / 2, 0]}
            rotation={[0, 0, -Math.PI / 4]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 1.5, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
        </>
      )}

      {/* Roof - Barn Style */}
      {roofStyle === 'barn' && (
        <>
          <mesh
            position={[-w / 4, h + roofHeight * 0.4, 0]}
            rotation={[0, 0, Math.PI / 5]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 0.8, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
          <mesh
            position={[w / 4, h + roofHeight * 0.4, 0]}
            rotation={[0, 0, -Math.PI / 5]}
            castShadow
          >
            <boxGeometry args={[w / 2 + 0.8, 0.15, d + 0.5]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>
        </>
      )}

      {/* Door(s) */}
      {Array.from({ length: doors }).map((_, i) => {
        const doorW = doorWidth * 0.5;
        const doorH = 3.5;
        const spacing = w / (doors + 1);
        const xPos = -w / 2 + spacing * (i + 1);

        return (
          <group key={`door-${i}`}>
            {/* Door opening (dark recess) */}
            <mesh position={[xPos, doorH / 2, d / 2 + 0.05]} castShadow>
              <boxGeometry args={[doorW, doorH, 0.3]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            {/* Door itself */}
            <mesh position={[xPos, doorH / 2, d / 2 + 0.15]} castShadow>
              <boxGeometry args={[doorW - 0.1, doorH - 0.1, 0.15]} />
              <meshStandardMaterial color={doorColor} />
            </mesh>
            {/* Door handle */}
            <mesh position={[xPos + doorW / 3, doorH / 2, d / 2 + 0.23]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      })}

      {/* Windows */}
      {Array.from({ length: windows }).map((_, i) => {
        const windowW = 1.5;
        const windowH = 1.5;
        const spacing = w / (windows + 1);
        const xPos = -w / 2 + spacing * (i + 1);
        const yPos = h * 0.6;

        return (
          <group key={`window-${i}`}>
            {/* Window frame */}
            <mesh position={[xPos, yPos, d / 2 + 0.12]} castShadow>
              <boxGeometry args={[windowW, windowH, 0.2]} />
              <meshStandardMaterial color={trimColor} />
            </mesh>
            {/* Window glass */}
            <mesh position={[xPos, yPos, d / 2 + 0.15]}>
              <boxGeometry args={[windowW - 0.2, windowH - 0.2, 0.1]} />
              <meshPhysicalMaterial
                color="#87CEEB"
                transparent
                opacity={0.6}
                metalness={0.1}
                roughness={0.1}
                transmission={0.9}
              />
            </mesh>
            {/* Window cross bars */}
            <mesh position={[xPos, yPos, d / 2 + 0.16]}>
              <boxGeometry args={[windowW - 0.1, 0.05, 0.05]} />
              <meshStandardMaterial color={trimColor} />
            </mesh>
            <mesh position={[xPos, yPos, d / 2 + 0.16]}>
              <boxGeometry args={[0.05, windowH - 0.1, 0.05]} />
              <meshStandardMaterial color={trimColor} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
