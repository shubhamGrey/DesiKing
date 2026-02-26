// styles/theme.js
import { createTheme, alpha } from "@mui/material/styles";
import palette from "./palette";

import { Poppins, Montserrat } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Modern shadow system
const shadows = {
  soft: "0 2px 8px -2px rgba(31, 79, 64, 0.08), 0 4px 16px -4px rgba(31, 79, 64, 0.12)",
  medium:
    "0 4px 12px -2px rgba(31, 79, 64, 0.1), 0 8px 24px -4px rgba(31, 79, 64, 0.15)",
  elevated:
    "0 8px 24px -4px rgba(31, 79, 64, 0.12), 0 16px 48px -8px rgba(31, 79, 64, 0.2)",
  glow: "0 0 20px rgba(255, 140, 0, 0.3)",
  card: "0 1px 3px rgba(31, 79, 64, 0.06), 0 4px 12px rgba(31, 79, 64, 0.08)",
  cardHover:
    "0 8px 24px rgba(31, 79, 64, 0.12), 0 16px 32px rgba(31, 79, 64, 0.08)",
};

const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: `${poppins.style.fontFamily}, sans-serif`,
    h1: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
      fontWeight: 600,
      lineHeight: 1.45,
    },
    subtitle1: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontFamily: `${poppins.style.fontFamily}, sans-serif`,
      fontWeight: 600,
      letterSpacing: "0.02em",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: "0.95rem",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          boxShadow: shadows.soft,
          "&:hover": {
            boxShadow: shadows.medium,
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1B4D3E 0%, #2D6A4F 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #E85D04 0%, #F48C06 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #F48C06 0%, #E85D04 100%)",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: alpha("#1B4D3E", 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: shadows.card,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: shadows.cardHover,
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: shadows.soft,
        },
        elevation2: {
          boxShadow: shadows.medium,
        },
        elevation3: {
          boxShadow: shadows.elevated,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          "&:hover": {
            boxShadow: shadows.soft,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: `0 0 0 4px ${alpha("#1B4D3E", 0.08)}`,
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 4px ${alpha("#1B4D3E", 0.12)}`,
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: alpha("#1B4D3E", 0.08),
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: shadows.elevated,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: "0.85rem",
          padding: "8px 16px",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: shadows.soft,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Export custom shadows for use in components
export { shadows };
export default theme;
