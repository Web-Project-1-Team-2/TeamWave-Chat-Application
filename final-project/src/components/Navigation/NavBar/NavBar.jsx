/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { logoutUser } from '../../../services/auth.service';
import { AppContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { onDisconnect, onValue, ref, set } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useListVals } from 'react-firebase-hooks/database';
import TeamCard from '../../Teams/TeamCard/TeamCard';
import { sideBarOpenStyles, sideBarStyles } from './NavBarStyling';
import SearchIcon from '@mui/icons-material/Search';
import SearchForUserModal from '../../Navigation/SearchForUserModal/SearchForUserModal';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import DirectMessageCard from '../../DirectMessages/DirectMessageCard/DirectMessageCard';
import ThemeModeSwitch from '../../Base/ThemeModeSwitch/ThemeModeSwitch';


function NavBar({ children }) {

    const theme = useTheme();

    const navigate = useNavigate();

    const { userData, setAppState, themeMode, toggleThemeMode } = useContext(AppContext);
    const [data, setData] = useState({
        username: '',
    });

    const userStatusDatabaseRef = ref(db, `users/${userData?.username}/status`);
    const connectedRef = ref(db, ".info/connected");

    const [searchModal, setSearchModal] = useState(false);
    const toggleSearchModal = () => setSearchModal(!searchModal);


    const [userTeams] = useListVals(ref(db, 'teams'));

    const [channelMessages] = useListVals(ref(db, 'channels'));
    const [unreadChannelMessages, setUnreadChannelMessages] = useState(false);

    const [userDirectMessages] = useListVals(ref(db, 'directMessages'));
    const [unreadDirectMessages, setUnreadDirectMessages] = useState(false);


    const [teamOpen, setTeamOpen] = useState(false);
    const [dmsOpen, setDmsOpen] = useState(false);

    const handleTeamDrawerOpen = () => {
        if (dmsOpen) setDmsOpen(false);

        setTeamOpen(true);
    };

    const handleTeamDrawerClose = () => {
        setTeamOpen(false);
    };

    const handleDmsDrawerOpen = () => {
        if (teamOpen) setTeamOpen(false);
        setDmsOpen(true);
    }

    const handleDmsDrawerClose = () => {
        setDmsOpen(false);
    }


    const logout = async () => {
        await logoutUser();
        await set(userStatusDatabaseRef, "offline");
        navigate('/');
        setAppState({ user: null, userData: null });
    };


    useEffect(() => {
        if (!channelMessages) return;
        if (!userData) return;

        const userChannels = channelMessages.filter(channel => channel.members[userData?.username] && 'id' in channel);
        const isUnread = userChannels.some(channel => {
            if (channel.messages === undefined) return false;

            const lastSeenUser = channel.members[userData?.username].lastAtChannel;
            const channelMessages = Object.values(channel.messages);

            return channelMessages.some(message => message.timestamp > lastSeenUser);
        });

        setUnreadChannelMessages(isUnread);
    }, [channelMessages, userData])

    useEffect(() => {
        if (!userDirectMessages) return;
        if (!userData) return;

        const userDms = userDirectMessages.filter(dm => dm.members[userData?.username] && 'id' in dm);
        const isUnread = userDms.some(dm => {
            if (dm.messages === undefined) return false;

            const lastSeenUser = dm.members[userData?.username].lastAtChat;
            const dmMessages = Object.values(dm.messages);

            return dmMessages.some(message => message.timestamp > lastSeenUser);
        });

        setUnreadDirectMessages(isUnread);
    }, [userDirectMessages, userData])

    useEffect(() => {
        if (!userData) return;
        setData({ ...userData, username: userData.username });
    }, [userData]);

    useEffect(() => {
        if (!userData) return;

        onValue(connectedRef, (snapshot) => {
            if (!userData) return;
            if (snapshot.val() === true) {
                set(userStatusDatabaseRef, "online")
            }
            onDisconnect(userStatusDatabaseRef).set("offline")
        })

    }, [userData])



    return (
        <div style={{ display: 'flex' }}>
            <Box sx={{ display: 'flex' }}>
                <Drawer sx={sideBarStyles} variant="permanent" anchor="left">
                    <Box>
                        <IconButton onClick={!teamOpen ? handleTeamDrawerOpen : handleTeamDrawerClose} aria-label="open-drawer" size="large" sx={{ margin: '20px auto 20px auto', }}>
                            {unreadChannelMessages ? (
                                <Box sx={{ position: 'relative', width: '30px', height: '30px' }}>
                                    <GroupsIcon fontSize='inherit' sx={{ zIndex: 1000 }} />
                                    <Box sx={{ borderRadius: '50%', bgcolor: '#d32f2f', width: '10px', height: '10px', position: 'absolute', right: '1px', bottom: '6px', zIndex: 1500 }} />
                                </Box>
                            ) : <GroupsIcon fontSize='inherit' sx={{ zIndex: 1000 }} />}
                        </IconButton >
                        <IconButton onClick={!dmsOpen ? handleDmsDrawerOpen : handleDmsDrawerClose} size="large" sx={{ margin: '0px auto 20px auto', }}>
                            {unreadDirectMessages ? (
                                <Box sx={{ position: 'relative', width: '30px', height: '30px' }}>
                                    {dmsOpen ? <ChatIcon fontSize='inherit' sx={{ zIndex: 1000 }} /> : <ChatOutlinedIcon fontSize='inherit' sx={{ zIndex: 1000 }} />}
                                    <Box sx={{ borderRadius: '50%', bgcolor: '#d32f2f', width: '10px', height: '10px', position: 'absolute', right: '1px', bottom: '6px', zIndex: 1500 }} />
                                </Box>
                            ) : (dmsOpen ? <ChatIcon fontSize='inherit' /> : <ChatOutlinedIcon fontSize='inherit' />)}
                        </IconButton>
                        <IconButton onClick={() => navigate('/')} aria-label="home" size="large" sx={{ margin: '0 auto 20px auto' }}>
                            <HomeOutlinedIcon fontSize='inherit' />
                        </IconButton>
                        <IconButton onClick={() => navigate('/createTeam')} aria-label="createTeam" size="large" sx={{ margin: '0 auto 20px auto' }}>
                            <AddCircleOutlineRoundedIcon fontSize='inherit' />
                        </IconButton>
                        <IconButton onClick={toggleSearchModal} size="large" aria-label="searchUser" sx={{ margin: '0 auto 20px auto' }}>
                            <SearchIcon fontSize='inherit' />
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton onClick={() => navigate('/profile')} aria-label="profile" size="large" sx={{ margin: '0 auto 20px auto' }}>
                            <AccountCircleOutlinedIcon fontSize='inherit' />
                        </IconButton>

                        <ThemeModeSwitch themeMode={themeMode} toggleTheme={toggleThemeMode} />

                        <IconButton onClick={logout} aria-label="logout" size="large" sx={{ margin: '0 auto 20px auto' }}>
                            <LogoutRoundedIcon fontSize='inherit' />
                        </IconButton>
                    </Box>
                </Drawer>
                <Drawer sx={sideBarOpenStyles(teamOpen)} variant="persistent" anchor="left" open={teamOpen}>
                    <Box style={{ width: '100%', textAlign: '-webkit-center' }} mt={2}>
                        {userTeams
                            .filter(team => data.username in team.members && 'id' in team)
                            .map(team => <TeamCard avatar={team.avatar} teamName={team.name} id={team.id} key={team.id} />)
                        }
                    </Box>

                    <IconButton onClick={handleTeamDrawerClose} aria-label="close-drawer" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon fontSize='inherit' /> : <ChevronRightIcon fontSize='inherit' />}
                    </IconButton>
                </Drawer>
                <Drawer sx={sideBarOpenStyles(dmsOpen)} variant="persistent" anchor="left" open={dmsOpen}>
                    <Box style={{ width: '90%', textAlign: '-webkit-center' }} mt={2}>
                        {userDirectMessages
                            .filter(dm => data.username in dm.members && 'id' in dm)
                            .map(dm => <DirectMessageCard directMessageId={dm.id} key={dm.id} />)
                        }
                    </Box>

                    <IconButton onClick={handleDmsDrawerClose} aria-label="close-drawer" size="large" sx={{ margin: '0 auto 20px auto' }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon fontSize='inherit' /> : <ChevronRightIcon fontSize='inherit' />}
                    </IconButton>
                </Drawer>
            </Box >
            <div style={{ 
                flex: 1,
                }}>
                {children}
            </div>
            <SearchForUserModal open={searchModal} toggleModal={toggleSearchModal} />
        </div>
    );
}

NavBar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NavBar;