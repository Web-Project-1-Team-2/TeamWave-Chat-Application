import { createTheme } from '@mui/material/styles';

export const lightPalette = {
    mode: 'light',
    primary: {
        main: '#4090a8',
        light: '#527d8d',
        dark: '#2d6b7d',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#4672b3',
    },
    error: {
        main: '#c13737',
        dark: '#f10909',
    },
    divider: 'rgba(0, 0, 0, 0.24)',
    background: {
        default: '#cfd6db',
        paper: '#e3e6ea',
    },
    text: {
        primary: '#2c2c2c',
        secondary: 'rgba(44, 44, 44, 0.7)',
        disabled: 'rgba(44, 44, 44, 0.5)',
        hint: 'rgba(44, 44, 44, 0.5)',
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
        dark: '#da1c1c',
    },
    divider: 'rgba(255,255,255,0.41)',
    background: {
        default: '#000f1c',
        paper: '#1b293b',
    },
    text: {
        primary: '#ffffff',
        secondary: 'rgba(255,255,255,0.7)',
        disabled: 'rgba(255,255,255,0.5)',
        hint: 'rgba(255,255,255,0.5)',
    },
};

export const theme = (mode) =>
    createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette,
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h6: {
                fontWeight: 600,
                fontSize: '1.1rem',
            },
            body1: {
                fontSize: '0.95rem',
                lineHeight: 1.5,
            },
            body2: {
                fontSize: '0.8rem',
                lineHeight: 1.3,
            },
            button: {
                textTransform: 'none',
            },
        },
    });

