import React, { useContext, useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { logoutUser } from '../../services/auth.service';
import { AppContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';

const drawerWidth = 70;

export default function NavBar() {
    const { appState, setAppState } = useContext(AppContext);
    const [userTeams, setUserTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (appState && appState.userData && appState.userData.uid) {
            const teamsRef = ref(db, 'teams');
            const unsubscribe = onValue(teamsRef, (snapshot) => {
                const teamsData = snapshot.val();
                if (teamsData) {
                    const userTeamsList = Object.entries(teamsData)
                        .filter(([_, team]) => team.members && team.members[appState.userData.uid])
                        .map(([id, team]) => ({ id, ...team }));
                    setUserTeams(userTeamsList);
                }
            });

            return () => unsubscribe();
        }
    }, [appState]);

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
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '20px 0',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box>
                    <IconButton
                        onClick={() => navigate('/createTeam')}
                        aria-label="createTeam"
                        size="large"
                        sx={{ margin: '0 auto 20px auto', display: 'block' }}
                    >
                        <AddCircleOutlineRoundedIcon />
                    </IconButton>

                    {userTeams.map((team) => (
                        <IconButton key={team.id} title={team.name}
                            onClick={() => navigate(`/team/${team.id}`)}
                            aria-label={team.name}
                            size="large"
                            sx={{ margin: '0 auto 20px auto', display: 'block' }}
                        >
                            <Avatar src={team.avatar}>
                                {team.name ? team.name[0].toUpperCase() : 'T'}
                            </Avatar>
                        </IconButton>

                    ))}
                </Box>

                <Box>
                    <IconButton
                        onClick={() => navigate('/profile')}
                        aria-label="Profile"
                        size="large"
                        sx={{ margin: '0 auto 20px auto', display: 'block' }}
                    >
                        <AccountCircleOutlinedIcon />
                    </IconButton>
                    <IconButton
                        onClick={logout}
                        aria-label="Logout"
                        size="large"
                        sx={{ margin: '0 auto', display: 'block' }}
                    >
                        <PowerSettingsNewOutlinedIcon />
                    </IconButton>
                </Box>
            </Drawer>
        </Box>
    );
}