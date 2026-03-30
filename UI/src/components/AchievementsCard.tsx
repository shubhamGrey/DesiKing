// UI/src/components/AchievementsCard.tsx
"use client";
import { pacifico } from "@/styles/fonts";
import theme from "@/styles/theme";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

interface AchievementsCardProps {
  value: string;   // e.g. "500+" or "3+"
  name: string;
  icon: React.ReactNode;
  description: string;
}

const AchievementsCard = ({ value, name, icon, description }: AchievementsCardProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Parse numeric target from strings like "500+" → 500, suffix → "+"
  const numericTarget = parseInt(value, 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  const { count, ref } = useCountUp(numericTarget, 1500);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(27, 77, 62, 0.18)" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile ? "95%" : "85%",
        padding: isMobile ? "16px" : "24px",
        borderRadius: "12px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.95) 100%)",
        boxShadow: "0 4px 20px rgba(27, 77, 62, 0.08)",
        border: "1px solid rgba(27, 77, 62, 0.1)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="start"
        width="100%"
        spacing={2}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #1B4D3E 0%, #2D7A5E 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(27, 77, 62, 0.3)",
            "& svg": { fontSize: isMobile ? "1.8rem" : "2.2rem" },
          }}
        >
          {icon}
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant={isMobile ? "h5" : "h3"}
            fontFamily={pacifico.style.fontFamily}
            fontWeight={600}
            sx={{
              background: "linear-gradient(135deg, #1B4D3E 0%, #E85D04 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {count}{suffix}
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            fontWeight={600}
            sx={{ color: "primary.main" }}
          >
            {name}
          </Typography>
        </Stack>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          mt: isMobile ? 1 : 2,
          color: "text.secondary",
          textAlign: "justify",
          lineHeight: 1.6,
          fontSize: isMobile ? "0.8rem" : "0.875rem",
        }}
      >
        {description}
      </Typography>
    </motion.div>
  );
};

export default AchievementsCard;
