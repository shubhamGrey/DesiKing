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
        width: "100%",
        py: 1,
      }}
    >
      <Box
        sx={{
          transform: visibleSectionsRef.current.has("achievements")
            ? "translateX(0)"
            : "translateX(100%)",
          opacity: visibleSectionsRef.current.has("achievements") ? 1 : 0,
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
        ref={sectionRefs.achievements}
      >
        <Stack
          direction={"row"}
          alignItems="start"
          justifyContent="center"
          sx={{
            p: 3,
            width: "100%",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(232, 93, 4, 0.1)",
            boxShadow: "0 4px 20px rgba(232, 93, 4, 0.08)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: "0 8px 30px rgba(232, 93, 4, 0.15)",
              borderColor: "rgba(232, 93, 4, 0.2)",
              "& .choose-icon": {
                transform: "scale(1.1) rotate(5deg)",
                background: "linear-gradient(135deg, #E85D04 0%, #F48C06 100%)",
                "& svg": {
                  color: "white",
                },
              },
            },
          }}
        >
          <Box
            className="choose-icon"
            sx={{
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(232, 93, 4, 0.1) 0%, rgba(27, 77, 62, 0.1) 100%)",
              boxShadow: "0 2px 8px rgba(232, 93, 4, 0.1)",
              "& svg": {
                fontSize: "1.8rem",
                color: "#E85D04",
                transition: "color 0.4s ease",
              },
            }}
          >
            {icon}
          </Box>
          <Stack
            direction={"column"}
            alignItems="flex-start"
            sx={{ ml: 3, flex: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                mb: 1,
              }}
            >
              {name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "justify",
                lineHeight: 1.7,
              }}
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
