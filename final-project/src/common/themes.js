import { createTheme } from '@mui/material/styles';

export const lightPalette = {
    mode: 'light',
    primary: {
        main: '#0277bd',
      },
      secondary: {
        main: '#795548',
      },
      background: {
        default: '#a4adb7',
        paper: '#c5cae9',
      },
      error: {
        main: '#e83829',
        light: '#d4594f',
        dark: '#8e2016',
      },
      warning: {
        main: '#f19207',
        light: '#efa12f',
        dark: '#bb7205',
      },
      info: {
        main: '#208fe6',
        light: '#53b0f9',
        dark: '#10578e',
      },
      success: {
        main: '#52b756',
        light: '#70c173',
        dark: '#367939',
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

