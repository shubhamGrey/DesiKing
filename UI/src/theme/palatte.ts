import { PaletteOptions } from '@mui/material/styles';

const lightPalette: PaletteOptions = {
    mode: 'light',
    primary: {
        main: '#1f4f40',
        light: '#63a4ff',
        dark: '#000000',
        contrastText: '#fef9f3',
    },
    secondary: {
        main: '#9c27b0',
        light: '#d05ce3',
        dark: '#6a0080',
        contrastText: '#fff',
    },
    error: {
        main: '#d32f2f',
        light: '#ff6659',
        dark: '#9a0007',
        contrastText: '#fff',
    },
    warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#fff',
    },
    info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#fff',
    },
    success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#fff',
    },
    background: {
        default: '#fffaf0',
        paper: '#fff',
    },
    text: {
        primary: '#555555',
        secondary: '#757575',
        disabled: '#bdbdbd',
    },
};

const darkPalette: PaletteOptions = {
    mode: 'dark',
    primary: {
        main: '#bd833c',
        light: '#e3f2fd',
        dark: '#42a5f5',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#ce93d8',
        light: '#f3e5f5',
        dark: '#ab47bc',
        contrastText: '#000',
    },
    error: {
        main: '#ef9a9a',
        light: '#ffcdd2',
        dark: '#c62828',
        contrastText: '#000',
    },
    warning: {
        main: '#ffb74d',
        light: '#ffe0b2',
        dark: '#f57c00',
        contrastText: '#000',
    },
    info: {
        main: '#81d4fa',
        light: '#b3e5fc',
        dark: '#0288d1',
        contrastText: '#000',
    },
    success: {
        main: '#a5d6a7',
        light: '#c8e6c9',
        dark: '#388e3c',
        contrastText: '#000',
    },
    background: {
        default: '#121212',
        paper: '#1e1e1e',
    },
    text: {
        primary: '#fff',
        secondary: '#bdbdbd',
        disabled: '#757575',
    },
};

// Export both palettes, or choose one to export as default
const palette = lightPalette;

export default palette;