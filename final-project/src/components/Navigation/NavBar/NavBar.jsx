import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
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
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useListVals } from 'react-firebase-hooks/database';
import TeamCard from '../../Teams/TeamCard/TeamCard';
import { sideBarOpenStyles, sideBarStyles } from './NavBarStyling';
import SearchIcon from '@mui/icons-material/Search';
import SearchForUserModal from '../../Navigation/SearchForUserModal/SearchForUserModal';


function NavBar({ children }) {

    const theme = useTheme();
    
    const navigate = useNavigate();

    const { userData, setAppState } = useContext(AppContext);
    const [data, setData] = useState({
        username: '',
    });

    const userStatusDatabaseRef = ref(db, `users/${userData?.username}/status`);
    const connectedRef = ref(db, ".info/connected");

    const [searchModal, setSearchModal] = useState(false);
    const toggleSearchModal = () => setSearchModal(!searchModal);


    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [userTeams] = useListVals(ref(db, 'teams'));


    const logout = async () => {
        await logoutUser();
        await set(userStatusDatabaseRef, "offline");
        navigate('/');
        setAppState({ user: null, userData: null });
    };


    useEffect(() => {
        if (!userData) return;
        setData({ ...userData, username: userData.username });
    }, [userData]);


    onValue(connectedRef, (snapshot) => {
        if (!userData) return;
        setTimeout(()=>{
      if (snapshot.val() === true) {
        set(userStatusDatabaseRef, "online")
      }
      onDisconnect(userStatusDatabaseRef).set("offline")
      })
    },100)


    return (
        <div style={{ display: 'flex' }}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer sx={sideBarStyles} variant="permanent" anchor="left">
                    <Box>
                        <IconButton onClick={!open ? handleDrawerOpen : handleDrawerClose} aria-label="open-drawer" size="large" sx={{ margin: '20px auto 20px auto' }}>
                            <MenuIcon fontSize='inherit' />
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
                        <IconButton onClick={logout} aria-label="logout" size="large" sx={{ margin: '0 auto 20px auto' }}>
                            <LogoutRoundedIcon fontSize='inherit' />
                        </IconButton>
                    </Box>
                </Drawer>
                <Drawer sx={sideBarOpenStyles(open)} variant="persistent" anchor="left" open={open}>
                    <Box style={{ width: '100%', textAlign: '-webkit-center' }} mt={2}>
                        {userTeams
                            .filter(team => data.username in team.members && 'id' in team)
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
            <SearchForUserModal open={searchModal} toggleModal={toggleSearchModal} />
        </div>
    );
}

NavBar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NavBar;