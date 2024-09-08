import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import TeamOwnerCard from '../../components/Teams/TeamOwnerCard/TeamOwnerCard';
import PeopleIcon from "@mui/icons-material/People";
import SendIcon from '@mui/icons-material/Send';
import { notifyError } from '../../services/notification.service';
import { createNewDirectMessage } from '../../services/directMessages.service';
import { avatarStyle, boxStyle } from './UserProfileStyling';

const UserProfile = () => {

    const { userData } = useContext(AppContext);
    const { username } = useParams();
    const navigate = useNavigate();

    const [userProfile, loadingUser] = useObjectVal(ref(db, `users/${username}`));
    const [teams] = useListVals(ref(db, `teams`));
    const [directMessages] = useListVals(ref(db, `directMessages`));


    const [mutualTeams, setMutualTeams] = useState([]);

    const handleGoToDirectMessage = async () => {
        const existingDirectMessage = directMessages.find(dm => username in dm.members && userData?.username in dm.members);

        try {
            if (existingDirectMessage) {
                navigate(`/dm/${existingDirectMessage.id}`);
            } else {
                const newDirectMessageChat = await createNewDirectMessage(userData?.username, username);
                navigate(`/dm/${newDirectMessageChat.id}`);
            }
        } catch (error) {
            console.error(error);
            notifyError('Error reaching the user chat');
        }
    }

    useEffect(() => {
        if (!teams || !userProfile || !userData) return;

        const mutual = teams.filter(team => userProfile?.username in team.members && userData?.username in team.members);

        setMutualTeams(mutual);

    }, [teams, userProfile, userData])


    if (loadingUser) return <div>Loading...</div>;

    return (
        <Box sx={{ width: '100%', height: '100%', padding: 2, }}>
            <Grid container spacing={2}>
                <Grid item xs={6} container direction={'column'}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Avatar src={userProfile?.avatar} sx={avatarStyle} />
                        <Typography variant="h3">{userProfile?.username}</Typography>
                        <Typography variant="h4">{userProfile?.firstName} {userProfile?.lastName}</Typography>
                        <Typography variant="h5">{userProfile?.email}</Typography>
                        <Box flexDirection="start">
                            <Button
                                endIcon={<SendIcon />}
                                variant='contained'
                                onClick={handleGoToDirectMessage}
                            >
                                Send Message
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item xs={6}
                    container direction={'column'}
                    sx={{ gap: 2 }}
                    alignItems="center"
                >
                    <Box
                        width="100%"
                        display="flex"
                        textAlign="center"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <PeopleIcon fontSize="medium" />
                        <Typography variant="h5">My teams:</Typography>
                    </Box>
                    <Box container
                        spacing={2}
                        sx={boxStyle}>
                        {mutualTeams.map(team => (
                            <TeamOwnerCard
                                key={team.id}
                                teamId={team.id}
                                avatar={team.avatar}
                                teamName={team.name}
                                teamMembers={team.members}
                                teamChannels={team.channels} />
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )

}

export default UserProfile
