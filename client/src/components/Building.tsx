import { useRef } from 'react';
import { useBuildingStore } from '../store/buildingStore';
import * as THREE from 'three';

export const Building = () => {
  const groupRef = useRef<THREE.Group>(null);
  const {
    width,
    depth,
    wallHeight,
    doorConfigs,
    windowConfigs,
    wallColor,
    roofColor,
    trimColor,
    doorColor,
    getRoofStyle,
  } = useBuildingStore();

  const roofStyle = getRoofStyle();

  // Door dimensions in feet (converted to 3D units)
  const doorDimensions = {
    '48-solid-shop': { width: 4, height: 7 }, // 48 inches = 4 ft
    '72-double-shop': { width: 6, height: 7 }, // 72 inches = 6 ft
    '36-solid-entry': { width: 3, height: 6.5 }, // 36 inches = 3 ft
    '36-9lite-entry': { width: 3, height: 6.5 },
  };

  // Window dimensions in feet
  const windowDimensions = {
    '2x3': { width: 2, height: 3 },
    '3x3': { width: 3, height: 3 },
  };

  // Convert feet to 3D units (1 foot = 0.5 units for better visualization)
  const w = width * 0.5;
  const d = depth * 0.5;
  const h = wallHeight * 0.5;

  // Roof height based on style
  const roofHeight = roofStyle === 'gambrel' ? h * 0.6 : h * 0.6;

  // Gambrel roof dimensions (barn style)
  const gambelBreakHeight = h * 0.3; // Where lower and upper roof meet

  // Calculate proper roof geometry
  // Lower section: from wall edge (±w/2) to break point (±w/4)
  const lowerHorizontalSpan = w / 4; // horizontal distance covered by lower section
  const lowerSectionLength = Math.sqrt(lowerHorizontalSpan * lowerHorizontalSpan + gambelBreakHeight * gambelBreakHeight);
  const lowerAngle = Math.atan2(gambelBreakHeight, lowerHorizontalSpan); // angle from horizontal

  // Upper section: from break point (±w/4) to peak (0)
  const upperHorizontalSpan = w / 4; // horizontal distance covered by upper section
  const upperVerticalSpan = roofHeight - gambelBreakHeight;
  const upperSectionLength = Math.sqrt(upperHorizontalSpan * upperHorizontalSpan + upperVerticalSpan * upperVerticalSpan);
  const upperAngle = Math.atan2(upperVerticalSpan, upperHorizontalSpan);

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

      {/* Roof - Gambrel Style (Barn) */}
      {roofStyle === 'gambrel' && (
        <>
          {/* Left Lower Section - from wall edge to break point */}
          <mesh
            position={[-3 * w / 8, h + gambelBreakHeight / 2, 0]}
            rotation={[0, 0, lowerAngle]}
            castShadow
          >
            <boxGeometry args={[lowerSectionLength, 0.2, d + 0.6]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>

          {/* Right Lower Section - from wall edge to break point */}
          <mesh
            position={[3 * w / 8, h + gambelBreakHeight / 2, 0]}
            rotation={[0, 0, -lowerAngle]}
            castShadow
          >
            <boxGeometry args={[lowerSectionLength, 0.2, d + 0.6]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>

          {/* Left Upper Section - from break point to peak */}
          <mesh
            position={[-w / 8, h + gambelBreakHeight + upperVerticalSpan / 2, 0]}
            rotation={[0, 0, upperAngle]}
            castShadow
          >
            <boxGeometry args={[upperSectionLength, 0.2, d + 0.6]} />
            <meshStandardMaterial color={roofColor} />
          </mesh>

          {/* Right Upper Section - from break point to peak */}
          <mesh
            position={[w / 8, h + gambelBreakHeight + upperVerticalSpan / 2, 0]}
            rotation={[0, 0, -upperAngle]}
            castShadow
          >
            <boxGeometry args={[upperSectionLength, 0.2, d + 0.6]} />
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

      {/* Roof - Lean-To Style */}
      {roofStyle === 'lean-to' && (
        <mesh
          position={[0, h + roofHeight / 2, 0]}
          rotation={[0, 0, Math.PI / 8]}
          castShadow
        >
          <boxGeometry args={[w + 1, 0.15, d + 0.5]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
      )}

      {/* Door(s) - New type-based system */}
      {doorConfigs.flatMap((doorConfig, configIndex) =>
        Array.from({ length: doorConfig.count }).map((_, countIndex) => {
          const index = configIndex + countIndex;
          const totalDoors = doorConfigs.reduce((sum, cfg) => sum + cfg.count, 0);
          const doorDims = doorDimensions[doorConfig.type];
          const doorW = doorDims.width * 0.5;
          const doorH = doorDims.height * 0.5;
          const spacing = w / (totalDoors + 1);
          const xPos = -w / 2 + spacing * (index + 1);
          const is9Lite = doorConfig.type === '36-9lite-entry';
          const isDouble = doorConfig.type === '72-double-shop';

          return (
            <group key={`door-${configIndex}-${countIndex}`}>
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
              {/* Door handle(s) */}
              {!isDouble && (
                <mesh position={[xPos + doorW / 3, doorH / 2, d / 2 + 0.23]} castShadow>
                  <boxGeometry args={[0.1, 0.3, 0.1]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
                </mesh>
              )}
              {isDouble && (
                <>
                  <mesh position={[xPos - doorW / 4, doorH / 2, d / 2 + 0.23]} castShadow>
                    <boxGeometry args={[0.1, 0.3, 0.1]} />
                    <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
                  </mesh>
                  <mesh position={[xPos + doorW / 4, doorH / 2, d / 2 + 0.23]} castShadow>
                    <boxGeometry args={[0.1, 0.3, 0.1]} />
                    <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
                  </mesh>
                </>
              )}
              {/* 9-lite windows on door */}
              {is9Lite && (
                <group>
                  {Array.from({ length: 9 }).map((_, liteIndex) => {
                    const row = Math.floor(liteIndex / 3);
                    const col = liteIndex % 3;
                    const liteW = doorW / 4;
                    const liteH = doorH / 5;
                    const liteX = xPos + (col - 1) * (liteW * 0.8);
                    const liteY = doorH * 0.7 - row * (liteH * 0.9);
                    return (
                      <mesh key={liteIndex} position={[liteX, liteY, d / 2 + 0.16]}>
                        <boxGeometry args={[liteW * 0.6, liteH * 0.7, 0.05]} />
                        <meshPhysicalMaterial
                          color="#87CEEB"
                          transparent
                          opacity={0.7}
                          metalness={0.1}
                          roughness={0.1}
                          transmission={0.9}
                        />
                      </mesh>
                    );
                  })}
                </group>
              )}
            </group>
          );
        })
      )}

      {/* Windows - New size-based system */}
      {windowConfigs.flatMap((windowConfig, configIndex) =>
        Array.from({ length: windowConfig.count }).map((_, countIndex) => {
          const index = configIndex + countIndex;
          const totalWindows = windowConfigs.reduce((sum, cfg) => sum + cfg.count, 0);
          const windowDims = windowDimensions[windowConfig.size];
          const windowW = windowDims.width * 0.5;
          const windowH = windowDims.height * 0.5;
          const spacing = w / (totalWindows + 1);
          const xPos = -w / 2 + spacing * (index + 1);
          const yPos = h * 0.6;

          return (
            <group key={`window-${configIndex}-${countIndex}`}>
              {/* Window frame */}
              <mesh position={[xPos, yPos, d / 2 + 0.12]} castShadow>
                <boxGeometry args={[windowW, windowH, 0.2]} />
                <meshStandardMaterial color={trimColor} />
              </mesh>
              {/* Window glass */}
              <mesh position={[xPos, yPos, d / 2 + 0.15]}>
                <boxGeometry args={[windowW - 0.1, windowH - 0.1, 0.1]} />
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
                <boxGeometry args={[windowW - 0.05, 0.05, 0.05]} />
                <meshStandardMaterial color={trimColor} />
              </mesh>
              <mesh position={[xPos, yPos, d / 2 + 0.16]}>
                <boxGeometry args={[0.05, windowH - 0.05, 0.05]} />
                <meshStandardMaterial color={trimColor} />
              </mesh>
            </group>
          );
        })
      )}
    </group>
  );
};
