import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface ChooseUsProps {
  name: string;
  icon: React.ReactNode;
  description: string;
}

const ChooseUs = ({ name, icon, description }: ChooseUsProps) => {
  const visibleSectionsRef = useRef<Set<string>>(new Set());
  const [, setRenderTrigger] = useState(0); // Trigger re-render when sections become visible
  const sectionRefs = {
    featuredProducts: useRef<HTMLDivElement>(null),
    achievements: useRef<HTMLDivElement>(null),
    chooseUs: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
  };

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
        overflow: "hidden", // Prevent horizontal scroll bar
      }}
    >
      <Box
        sx={{
          transform: visibleSectionsRef.current.has("achievements")
            ? "translateX(0)"
            : "translateX(100%)", // Changed from -100% to 100%
          opacity: visibleSectionsRef.current.has("achievements") ? 1 : 0,
          transition: "transform 0.8s ease, opacity 0.8s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        ref={sectionRefs.achievements}
      >
        <Stack
          direction={"row"}
          alignItems="start"
          justifyContent="center"
          color={"primary.main"}
          sx={{
            p: 3,
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(31, 79, 64, 0.1)",
            boxShadow: "0 4px 20px rgba(31, 79, 64, 0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 30px rgba(31, 79, 64, 0.12)",
              "& .choose-icon": {
                transform: "scale(1.1)",
                color: "secondary.main",
              },
            },
          }}
        >
          <Box
            className="choose-icon"
            sx={{
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1.5,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(31, 79, 64, 0.1), rgba(255, 140, 0, 0.1))",
            }}
          >
            {icon}
          </Box>
          <Stack direction={"column"} alignItems="center" sx={{ ml: 3 }}>
            <Typography
              variant="h5"
              sx={{ width: "100%", mb: 2 }}
              color={"primary.main"}
            >
              {name}
            </Typography>

            <Typography
              variant="body2"
              color={"text.primary"}
              textAlign={"justify"}
            >
              {description}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChooseUs;
