import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function MovingStars() {
  const group = useRef();
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y -= delta * 0.03;
      group.current.rotation.x -= delta * 0.01;
    }
  });

  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function Background3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', background: '#06060c' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={1} />
        <fog attach="fog" args={['#06060c', 10, 80]} />
        <MovingStars />
      </Canvas>
      {/* Soft overlay gradient to blend with the bottom of the page */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '30vh', background: 'linear-gradient(to bottom, rgba(6,6,12,0), rgba(6,6,12,1))' }}></div>
    </div>
  );
}

export default Background3D;
