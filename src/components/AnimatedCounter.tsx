import React, { useEffect, useRef, useState } from "react";
import { m as motion, useInView } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 2000,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center space-y-2"
    >
      <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
        <span className="text-primary-container">{prefix}</span>
        {count}
        <span className="text-primary-container">{suffix}</span>
      </div>
      <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest font-bold">{label}</p>
    </motion.div>
  );
};

export default AnimatedCounter;
