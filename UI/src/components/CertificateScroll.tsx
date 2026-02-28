"use client";

import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { VerifiedOutlined } from "@mui/icons-material";
import Image from "next/image";

interface Certificate {
  name: string;
  image: string;
  fullName: string;
}

const certificates: Certificate[] = [
  {
    name: "APEDA",
    fullName: "Agricultural Products Export Development Authority",
    image: "/certificates/APEDA.png",
  },
  {
    name: "HACCP",
    fullName: "Hazard Analysis Critical Control Points",
    image: "/certificates/HACCP.png",
  },
  {
    name: "FSSAI",
    fullName: "Food Safety and Standards Authority of India",
    image: "/certificates/FSSAI.png",
  },
  {
    name: "IIA",
    fullName: "Indian Importers Association",
    image: "/certificates/IIA.png",
  },
  {
    name: "SPICE BOARD",
    fullName: "Spices Board of India",
    image: "/certificates/SpiceBoard.png",
  },
  {
    name: "ISO",
    fullName: "International Organization for Standardization",
    image: "/certificates/ISO.png",
  },
];

const CertificateScroll: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        mt: isMobile ? 6 : 10,
        mb: isMobile ? 4 : 8,
        position: "relative",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: isMobile ? 3 : 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Box
            sx={{
              width: isMobile ? 40 : 50,
              height: 3,
              background: "linear-gradient(90deg, transparent, #1B4D3E)",
              borderRadius: 2,
            }}
          />
          <VerifiedOutlined
            sx={{
              fontSize: isMobile ? 28 : 36,
              color: "primary.main",
            }}
          />
          <Box
            sx={{
              width: isMobile ? 40 : 50,
              height: 3,
              background: "linear-gradient(90deg, #1B4D3E, transparent)",
              borderRadius: 2,
            }}
          />
        </Box>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            color: "primary.main",
            fontWeight: 700,
          }}
          textAlign="center"
        >
          Quality Certifications
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 1,
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          Trusted by international standards for quality and safety
        </Typography>
      </Box>

      {/* Certificate Scroll Container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          py: isMobile ? 3 : 4,
          background:
            "linear-gradient(135deg, rgba(27, 77, 62, 0.03) 0%, rgba(232, 93, 4, 0.03) 100%)",
          borderRadius: 4,
          border: "1px solid rgba(27, 77, 62, 0.08)",
        }}
      >
        {/* Gradient Overlays */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: isMobile ? "60px" : "100px",
            background:
              "linear-gradient(to right, rgba(250, 250, 249, 1), transparent)",
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
            width: isMobile ? "60px" : "100px",
            background:
              "linear-gradient(to left, rgba(250, 250, 249, 1), transparent)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Scrolling Container */}
        <Box
          component="div"
          sx={{
            display: "flex",
            gap: isMobile ? 2.5 : 4,
            px: isMobile ? 2 : 4,
            animation: "scroll 35s linear infinite",
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
                minWidth: isMobile ? "160px" : "200px",
              }}
            >
              {/* Certificate Card */}
              <Box
                sx={{
                  position: "relative",
                  width: isMobile ? "140px" : "180px",
                  height: isMobile ? "140px" : "180px",
                  backgroundColor: "#ffffff",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "default",
                  pointerEvents: "none",
                  border: "1px solid rgba(27, 77, 62, 0.08)",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 12px 32px rgba(27, 77, 62, 0.15)",
                    borderColor: "primary.main",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: "linear-gradient(90deg, #1B4D3E, #E85D04)",
                    borderRadius: "12px 12px 0 0",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover::before": {
                    opacity: 1,
                  },
                }}
              >
                <Image
                  src={cert.image}
                  alt={cert.name}
                  width={isMobile ? 110 : 140}
                  height={isMobile ? 110 : 140}
                  style={{
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                  priority={index < certificates.length}
                  draggable={false}
                />
              </Box>

              {/* Certificate Name */}
              <Box
                sx={{
                  mt: 1.5,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    fontSize: isMobile ? "0.75rem" : "0.85rem",
                  }}
                >
                  {cert.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: isMobile ? "none" : "block",
                    fontSize: "0.65rem",
                    maxWidth: 160,
                    lineHeight: 1.3,
                  }}
                >
                  {cert.fullName}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Bottom Trust Badge */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 1,
            borderRadius: 3,
            backgroundColor: "rgba(27, 77, 62, 0.06)",
            border: "1px solid rgba(27, 77, 62, 0.1)",
          }}
        >
          <VerifiedOutlined sx={{ fontSize: 18, color: "primary.main" }} />
          <Typography
            variant="caption"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            100% QUALITY ASSURED
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CertificateScroll;
