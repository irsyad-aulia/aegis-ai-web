import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function MagneticElement({ children, className = "", style = {}, magneticPull = 0.4 }) {
  const ref = useRef(null);
  
  // Use motion values instead of React state for 60FPS tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = left + width / 2;
    const middleY = top + height / 2;
    
    const offsetX = (clientX - middleX) * magneticPull;
    const offsetY = (clientY - middleY) * magneticPull;

    x.set(offsetX);
    y.set(offsetY);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: smoothX, y: smoothY, display: 'inline-block', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default MagneticElement;
