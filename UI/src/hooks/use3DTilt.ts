// UI/src/hooks/use3DTilt.ts
import { useRef, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none)").matches;

export function use3DTilt(maxAngle = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice() || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      rawRotateY.set(nx * maxAngle);
      rawRotateX.set(-ny * maxAngle);
    },
    [maxAngle, rawRotateX, rawRotateY]
  );

  const onMouseLeave = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }, [rawRotateX, rawRotateY]);

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}
