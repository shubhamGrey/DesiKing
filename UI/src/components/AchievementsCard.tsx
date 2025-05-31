import { michroma, pacifico } from "@/app/layout";
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
        justifyContent="start"
        color={theme.palette.primary.main}
        width={"100%"}
      >
        {icon}
        <Stack direction={"column"} alignItems="center" sx={{ ml: 4 }}>
          <Typography
            variant="h2"
            fontFamily={pacifico.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
          >
            {value}
          </Typography>

          <Typography
            variant="h6"
            fontFamily={michroma.style.fontFamily}
            fontStyle={"italic"}
            fontWeight={600}
            textAlign={"center"}
          >
            {name}
          </Typography>
        </Stack>
      </Stack>

      <Typography
        variant="body1"
        color={theme.palette.text.primary}
        textAlign={"justify"}
        sx={{ mt: 2 }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default AchievementsCard;
