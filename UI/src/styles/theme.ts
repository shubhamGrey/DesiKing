// styles/theme.js
import { createTheme } from "@mui/material/styles";
import palette from "./palette";

const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

export default theme;
