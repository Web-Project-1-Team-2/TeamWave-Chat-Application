import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { logoutUser } from '../../services/auth.service';
import { AppContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useListVals } from 'react-firebase-hooks/database';
import TeamCard from '../TeamCard/TeamCard';

const drawerWidth = 70;

const openDrawerWidth = 280;

export default function NavBar({ children }) {

    const { userData, setAppState } = useContext(AppContext);
    const [data, setData] = useState({
        username: '',
    });



    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const hideDrawer = open ? openDrawerWidth : drawerWidth;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [userTeams, teamsLoading] = useListVals(ref(db, 'teams'));

    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) return;
        setData({ ...userData, username: userData.username });
    }, [userData]);

    const logout = async () => {
        await logoutUser();
        navigate('/');
        setAppState({ user: null, userData: null });
    };

    return (
        <div style={{ display: 'flex' }}>
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
                        position: 'relative',
                    }}
                    variant="permanent"
                    anchor="left"
                >

                    <IconButton onClick={!open ? handleDrawerOpen : handleDrawerClose} aria-label="open-drawer" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        <MenuIcon fontSize='inherit' />
                    </IconButton>
                    <IconButton onClick={() => navigate('/createTeam')} aria-label="createTeam" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        <AddCircleOutlineRoundedIcon fontSize='inherit' />
                    </IconButton>
                    <IconButton onClick={() => navigate('/profile')} aria-label="profile" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        <AccountCircleOutlinedIcon fontSize='inherit' />
                    </IconButton>
                    <IconButton onClick={() => navigate('/')} aria-label="home" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        <HomeOutlinedIcon fontSize='inherit' />
                    </IconButton>
                    <IconButton onClick={logout} aria-label="logout" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        <PowerSettingsNewOutlinedIcon fontSize='inherit' />
                    </IconButton>

                </Drawer>
                <Drawer
                    sx={{
                        width: hideDrawer,
                        flexShrink: 0,
                        display: open ? 'block' : 'none',
                        left: open ? drawerWidth : 0,
                        '& .MuiDrawer-paper': {
                            width: hideDrawer,
                            boxSizing: 'border-box',
                            zIndex: 1000,
                            left: drawerWidth,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >

                    <Box style={{ width: '100%', textAlign: '-webkit-center'}} mt={2}>
                        {userTeams
                            .filter(team => data.username in team.members)
                            .map(team => <TeamCard avatar={team.avatar} teamName={team.name} id={team.id} key={team.id} />)
                        }
                    </Box>


                    <IconButton onClick={handleDrawerClose} aria-label="close-drawer" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon fontSize='inherit' /> : <ChevronRightIcon fontSize='inherit' />}
                    </IconButton>
                </Drawer>
            </Box >
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}

NavBar.propTypes = {
    children: PropTypes.node.isRequired,
};