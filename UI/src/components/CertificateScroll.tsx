"use client";

import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { michroma } from "@/styles/fonts";

interface Certificate {
  name: string;
  image: string;
}

const certificates: Certificate[] = [
  { name: "FSSAI", image: "/certificates/FSSAI.jpg" },
  { name: "HACCP", image: "/certificates/HACCP.webp" },
  { name: "CE", image: "/certificates/CE.svg" },
  { name: "ORGANIC", image: "/certificates/ORGANIC.svg" },
  { name: "HALAL", image: "/certificates/HALAL.avif" },
  { name: "KOSHER", image: "/certificates/KOSHER.svg" },
  { name: "ISO", image: "/certificates/ISO.svg" },
];

const CertificateScroll: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        mt: isMobile ? 8 : 15,
        mb: isMobile ? 8 : 15,
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: isMobile ? 3 : 8,
          color: "primary.main",
        }}
        fontFamily={michroma.style.fontFamily}
        fontWeight={600}
        textAlign="center"
      >
        Our Certifications
      </Typography>

      {/* Certificate Scroll Container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          py: isMobile ? 2 : 4,
          backgroundColor: "#f8f3ea",
          borderRadius: "12px",
        }}
      >
        {/* Gradient Overlays */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: isMobile ? "40px" : "60px",
            backgroundImage: "linear-gradient(to right, #f8f3ea, transparent)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: isMobile ? "40px" : "60px",
            backgroundImage: "linear-gradient(to left, #f8f3ea, transparent)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Scrolling Container */}
        <Box
          component="div"
          sx={{
            display: "flex",
            gap: isMobile ? 2 : 4,
            px: isMobile ? 2 : 4,
            animation: "scroll 30s linear infinite",
            "@keyframes scroll": {
              "0%": {
                transform: "translateX(0)",
              },
              "100%": {
                transform: "translateX(-50%)",
              },
            },
            "&:hover": {
              animationPlayState: "paused",
            },
            willChange: "transform",
          }}
        >
          {/* Render certificates twice for seamless loop */}
          {[...certificates, ...certificates].map((cert, index) => (
            <Box
              key={`${cert.name}-${index}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: isMobile ? "180px" : "220px",
              }}
            >
              {/* Certificate Image */}
              <Box
                sx={{
                  position: "relative",
                  width: isMobile ? "160px" : "200px",
                  height: isMobile ? "160px" : "200px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  cursor: "default",
                  pointerEvents: "none",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <Image
                  src={cert.image}
                  alt={cert.name}
                  width={isMobile ? 140 : 180}
                  height={isMobile ? 140 : 180}
                  style={{
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                  priority={index < certificates.length}
                  draggable={false}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CertificateScroll;
