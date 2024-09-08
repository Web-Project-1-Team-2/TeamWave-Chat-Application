import { createTheme } from '@mui/material/styles';

export const lightPalette = {
    mode: 'light',
    primary: {
        main: '#4090a8', // Keeping the same primary color for consistency
        light: '#527d8d', // Darker light shade for primary
        dark: '#2d6b7d', // Slightly darkened dark shade
        contrastText: '#ffffff', // White text to maintain readability on primary
    },
    secondary: {
        main: '#4672b3', // Retaining the secondary color for consistency
    },
    error: {
        main: '#c13737', // Darkened red for error
    },
    divider: 'rgba(0, 0, 0, 0.24)', // Darkened divider for softer contrast
    background: {
        default: '#cfd6db', // Darker, muted gray background for reduced brightness
        paper: '#e3e6ea', // Slightly darker paper background than before
    },
    text: {
        primary: '#2c2c2c', // Darker gray (soft black) for primary text
        secondary: 'rgba(44, 44, 44, 0.7)', // Softer dark gray for secondary text
        disabled: 'rgba(44, 44, 44, 0.5)', // Medium-dark gray for disabled text
        hint: 'rgba(44, 44, 44, 0.5)', // Same tone for hints
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
        // components: {
        //     MuiDivider: {
        //       styleOverrides: {
        //         root: {
        //             borderColor: '#000000', 

        //         },
        //       },
        //     },
        //   },

    });

