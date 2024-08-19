import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { logoutUser } from '../../services/auth.service';
import { useContext } from 'react';
import { AppContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 70;

export default function NavBar() {
    const { setAppState } = useContext(AppContext);

    const navigate = useNavigate();

    const logout = async () => {
        await logoutUser();
        navigate('/');
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
                <IconButton onClick={() => navigate('/createTeam')} aria-label="createTeam" size="large" sx={{ margin: '0 auto 20px auto' }}>
                    <AddCircleOutlineRoundedIcon fontSize='inherit' />
                </IconButton>
                <IconButton onClick={() => navigate('/profile')} aria-label="Profile" size="large" sx={{ margin: '0 auto 20px auto' }}>
                    <AccountCircleOutlinedIcon fontSize='inherit' />
                </IconButton>
                <IconButton onClick={logout} aria-label="Logout" size="large" sx={{ margin: '0 auto 20px auto' }}>
                    <PowerSettingsNewOutlinedIcon fontSize='inherit' />
                </IconButton>
            </Drawer>
        </Box>
    );
}