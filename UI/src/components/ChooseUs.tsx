import { pacifico } from "@/app/layout";
import theme from "@/styles/theme";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";

interface ChooseUsProps {
  name: string;
  icon: React.ReactNode;
  description: string;
}

const ChooseUs = ({ name, icon, description }: ChooseUsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mb: 10,
      }}
    >
      <Stack
        direction={"row"}
        alignItems="start"
        justifyContent="center"
        color={theme.palette.primary.main}
      >
        {icon}
        <Stack direction={"column"} alignItems="center" sx={{ ml: 4 }}>
          <Typography
            variant="h4"
            sx={{ width: "100%", mb: 2 }}
            fontFamily={pacifico.style.fontFamily}
            color={theme.palette.primary.main}
          >
            {name}
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.text.primary}
            textAlign={"justify"}
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChooseUs;
