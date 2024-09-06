import { createTheme } from '@mui/material/styles';

export const lightPalette = {
    mode: 'light',
    primary: {
        main: '#4882c1',
        light: '#6c9bcd',
        dark: '#325b87',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#fdc37e',
    },
    background: {
        default: '#f4faff',
        paper: '#ffffff',
    },
    error: {
        main: '#ff1000',
    },
    success: {
        main: '#4caf50',
        light: '#6fbf74',
        dark: '#357a38',
    },
    info: {
        main: '#2196f3',
        light: '#4dabf5',
        dark: '#1769aa',
        contrastText: '#ffffff',
    },
    warning: {
        main: '#ff9800',
        light: '#ffac33',
        dark: '#b26a00',
    },
};

export const darkPalette = {
    mode: 'dark',
    primary: {
        main: '#4090a8',
        light: '#506681',
        dark: '#16293f',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#4672b3',
    },
    error: {
        main: '#fb2a2a',
    },
    divider: 'rgba(255,255,255,0.41)',
    background: {
        default: '#000f1c',
        paper: '#1b293b',
    },
};

export const theme = (mode) =>
    createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette,
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h6: {
                fontWeight: 600,  // Used for chat header/title
                fontSize: '1.1rem',
            },
            body1: {
                fontSize: '0.95rem',  // Normal message text size
                lineHeight: 1.5,
            },
            body2: {
                fontSize: '0.8rem',   // Secondary text (timestamp)
                lineHeight: 1.3,
            },
            button: {
                textTransform: 'none', // Avoid uppercase buttons
            },
        },

    });