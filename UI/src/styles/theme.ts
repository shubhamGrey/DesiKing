// styles/theme.js
import { createTheme } from "@mui/material/styles";
import palette from "./palette";

import { Poppins, Montserrat } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: `${poppins.style.fontFamily}, sans-serif`,
    h1: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
    },
    h2: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
    },
    h3: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
    },
    h4: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
    },
    h5: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
    },
    h6: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 600,
    },
    body1: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 400,
    },
    body2: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 400,
    },
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
