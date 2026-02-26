import { pacifico } from "@/styles/fonts";
import theme from "@/styles/theme";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface AchievementsCardProps {
  value: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const AchievementsCard = ({
  value,
  name,
  icon,
  description,
}: AchievementsCardProps) => {
  const visibleSectionsRef = useRef<Set<string>>(new Set());
  const [, setRenderTrigger] = useState(0); // Trigger re-render when sections become visible
  const sectionRefs = {
    featuredProducts: useRef<HTMLDivElement>(null),
    achievements: useRef<HTMLDivElement>(null),
    chooseUs: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleScroll = () => {
    let updated = false;
    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !visibleSectionsRef.current.has(key)) {
          visibleSectionsRef.current.add(key);
          updated = true;
        } else if (!isVisible && visibleSectionsRef.current.has(key)) {
          visibleSectionsRef.current.delete(key);
          updated = true;
        }
      }
    });
    if (updated) {
      setRenderTrigger((prev) => prev + 1); // Trigger re-render
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile ? "95%" : "85%",
        p: isMobile ? 2 : 3,
        borderRadius: 3,
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.95) 100%)",
        boxShadow: "0 4px 20px rgba(27, 77, 62, 0.08)",
        border: "1px solid rgba(27, 77, 62, 0.1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: visibleSectionsRef.current.has("achievements")
          ? "translateX(0)"
          : "translateX(-100%)",
        opacity: visibleSectionsRef.current.has("achievements") ? 1 : 0,
        "&:hover": {
          boxShadow: "0 12px 32px rgba(27, 77, 62, 0.15)",
          borderColor: "rgba(27, 77, 62, 0.2)",
        },
      }}
      ref={sectionRefs.achievements}
    >
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="start"
        width={"100%"}
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
            "& svg": {
              fontSize: isMobile ? "1.8rem" : "2.2rem",
            },
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
              color: "primary.main",
              background: "linear-gradient(135deg, #1B4D3E 0%, #E85D04 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {value}
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
    </Box>
  );
};

export default AchievementsCard;
