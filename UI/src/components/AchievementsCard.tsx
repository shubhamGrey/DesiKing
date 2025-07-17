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
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile ? "85%" : "70%",
        height: "100%",
      }}
      sx={{
        transform: visibleSectionsRef.current.has("achievements")
          ? "translateX(0)"
          : "translateX(-100%)",
        opacity: visibleSectionsRef.current.has("achievements") ? 1 : 0,
        transition: "transform 0.8s ease, opacity 0.8s ease",
      }}
      ref={sectionRefs.achievements}
    >
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="start"
        color={"primary.main"}
        width={"100%"}
      >
        {icon}
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems="center"
          sx={{ ml: 4 }}
        >
          <Typography
            variant="h3"
            fontFamily={pacifico.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
            sx={{ mb: 1 }}
          >
            {value}
          </Typography>

          <Typography
            variant="h5"
            fontFamily={pacifico.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
            sx={{ ml: 3 }}
          >
            {name}
          </Typography>
        </Stack>
      </Stack>

      <Typography
        variant="body2"
        color={"text.primary"}
        textAlign={"justify"}
        sx={{ mt: 2 }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default AchievementsCard;
