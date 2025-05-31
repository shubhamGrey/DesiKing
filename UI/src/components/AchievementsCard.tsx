import theme from "@/styles/theme";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";

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
  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "70%",
          height: "100%",
        }}
      >
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent="center"
          color={theme.palette.primary.contrastText}
        >
          {icon}
          <Stack direction={"column"} alignItems="center" sx={{ ml: 2 }}>
            <Typography
              variant="h3"
              color={theme.palette.primary.contrastText}
              fontWeight={600}
              textAlign={"center"}
            >
              {value}
            </Typography>

            <Typography
              variant="h5"
              color={theme.palette.primary.contrastText}
              fontFamily={"Playfair Display, serif"}
              fontStyle={"italic"}
              fontWeight={600}
              textAlign={"center"}
            >
              {name}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          color={theme.palette.primary.contrastText}
          textAlign={"justify"}
          sx={{ mt: 1 }}
        >
          {description}
        </Typography>
      </Box>
    </>
  );
};

export default AchievementsCard;
