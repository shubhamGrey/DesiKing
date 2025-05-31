// styles/theme.js
import { createTheme } from "@mui/material/styles";
import palette from "./palette";

const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
