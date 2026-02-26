import { PaletteOptions } from "@mui/material/styles";

const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#1B4D3E", // Deep emerald - more saturated, modern
    light: "#2D6A4F", // Lighter forest green
    dark: "#0F2E24", // Very dark green for contrast
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#E85D04", // Vibrant burnt orange - more contemporary
    light: "#F48C06", // Warm golden orange
    dark: "#D00000", // Deep red-orange for accents
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#DC2626",
    light: "#F87171",
    dark: "#991B1B",
    contrastText: "#fff",
  },
  warning: {
    main: "#F59E0B",
    light: "#FCD34D",
    dark: "#D97706",
    contrastText: "#000",
  },
  info: {
    main: "#0EA5E9",
    light: "#38BDF8",
    dark: "#0369A1",
    contrastText: "#fff",
  },
  success: {
    main: "#059669",
    light: "#34D399",
    dark: "#047857",
    contrastText: "#fff",
  },
  background: {
    default: "#FAFAF9", // Clean off-white (stone-50)
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1C1917", // Almost black for strong contrast
    secondary: "#57534E", // Warm gray
    disabled: "#A8A29E",
  },
};

// const darkPalette: PaletteOptions = {
//     mode: 'dark',
//     primary: {
//         main: '#bd833c',
//         light: '#e3f2fd',
//         dark: '#42a5f5',
//         contrastText: '#ffffff',
//     },
//     secondary: {
//         main: '#ce93d8',
//         light: '#f3e5f5',
//         dark: '#ab47bc',
//         contrastText: '#000',
//     },
//     error: {
//         main: '#ef9a9a',
//         light: '#ffcdd2',
//         dark: '#c62828',
//         contrastText: '#000',
//     },
//     warning: {
//         main: '#ffb74d',
//         light: '#ffe0b2',
//         dark: '#f57c00',
//         contrastText: '#000',
//     },
//     info: {
//         main: '#81d4fa',
//         light: '#b3e5fc',
//         dark: '#0288d1',
//         contrastText: '#000',
//     },
//     success: {
//         main: '#a5d6a7',
//         light: '#c8e6c9',
//         dark: '#388e3c',
//         contrastText: '#000',
//     },
//     background: {
//         default: '#121212',
//         paper: '#1e1e1e',
//     },
//     text: {
//         primary: '#fff',
//         secondary: '#bdbdbd',
//         disabled: '#757575',
//     },
// };

// Export both palettes, or choose one to export as default
const palette = lightPalette;

export default palette;
