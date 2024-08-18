import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import { logoutUser } from '../../services/auth.service';
import { useContext } from 'react';
import { AppContext } from '../../context/authContext';

const drawerWidth = 80;

export default function NavBar() {
    const { setAppState } = useContext(AppContext);

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        justifyContent: "flex-end",
                        gap: "10px",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <IconButton aria-label="Profile" size="string" sx={{margin: '0 auto 20px auto'}}>
                    <AccountCircleOutlinedIcon fontSize='large' />
                </IconButton>
                <IconButton onClick={logout} aria-label="Logout" size="string" sx={{margin: '0 auto 20px auto'}}>
                    <PowerSettingsNewOutlinedIcon fontSize='large' />
                </IconButton>
            </Drawer>
        </Box>
    );
}