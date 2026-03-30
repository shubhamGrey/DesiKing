// UI/src/components/ChooseUs.tsx
"use client";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import LottieIcon from "@/components/LottieIcon";

interface ChooseUsProps {
  name: string;
  icon: React.ReactNode;
  lottieIcon?: string;
  description: string;
}

const ChooseUs = ({ name, icon, lottieIcon, description }: ChooseUsProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", py: 1 }}>
      <motion.div
        initial={{ opacity: 0, rotateY: 90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        style={{ width: "100%", perspective: 1000, transformStyle: "preserve-3d" }}
        whileHover={{ y: -6, scale: 1.02 }}
      >
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="center"
          sx={{
            p: 3,
            width: "100%",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.9) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(232, 93, 4, 0.1)",
            boxShadow: "0 4px 20px rgba(232, 93, 4, 0.08)",
            transition: "box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: "0 8px 30px rgba(232, 93, 4, 0.18)",
              borderColor: "rgba(232, 93, 4, 0.25)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1.5,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(232,93,4,0.1) 0%, rgba(27,77,62,0.1) 100%)",
              boxShadow: "0 2px 8px rgba(232, 93, 4, 0.1)",
              flexShrink: 0,
            }}
          >
            {lottieIcon ? (
              <LottieIcon src={lottieIcon} fallback={icon} size={44} loop={false} autoplay={false} />
            ) : (
              <Box sx={{ "& svg": { fontSize: "1.8rem", color: "#E85D04" } }}>{icon}</Box>
            )}
          </Box>
          <Stack direction="column" alignItems="flex-start" sx={{ ml: 3, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "justify", lineHeight: 1.7 }}>
              {description}
            </Typography>
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default ChooseUs;
