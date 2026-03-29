// UI/src/components/LottieIcon.tsx
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieIconProps {
  src: string; // path relative to /public, e.g. "/lottie/chili.json"
  fallback: React.ReactNode;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieIcon = ({
  src,
  fallback,
  size = 48,
  loop = true,
  autoplay = true,
}: LottieIconProps) => {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(setAnimationData)
      .catch(() => setFailed(true));
  }, [src]);

  if (failed || (!animationData && !failed)) {
    // Show fallback while loading or on error
    return <Box sx={{ display: "flex", alignItems: "center" }}>{fallback}</Box>;
  }

  return (
    <Box sx={{ width: size, height: size }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: size, height: size }}
      />
    </Box>
  );
};

export default LottieIcon;
