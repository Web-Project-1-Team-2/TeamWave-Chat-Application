import { useParams } from 'react-router-dom';
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import TeamOwnerCard from '../../components/Teams/TeamOwnerCard/TeamOwnerCard';

const UserProfile = () => {

    const { userData } = useContext(AppContext);
    const { username } = useParams();

    const [userProfile, loadingUser] = useObjectVal(ref(db, `users/${username}`));
    const [teams, loadingTeams] = useListVals(ref(db, `teams`));

    const [mutualTeams, setMutualTeams] = useState([]);

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
                        <Avatar src={userProfile?.avatar} sx={{ width: 250, height: 250 }} />
                        <Typography variant="h3">{userProfile?.username}</Typography>
                        <Typography variant="h4">{userProfile?.firstName} {userProfile?.lastName}</Typography>
                        <Typography variant="h5">{userProfile?.email}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} container direction={'column'} sx={{gap: 2}}>
                    <Box>
                        <Typography variant="h4">Mutual Teams</Typography>
                    </Box>
                    <Box container 
                    spacing={2} 
                    sx={{
                        width: '70%',
                        maxHeight: 400,
                        overflowY: 'auto',
                        }}>
                            {mutualTeams.map(team => (
                                <TeamOwnerCard 
                                    key={team.id} 
                                    avatar={team.avatar}
                                    teamName={team.name}
                                    teamMembers={team.members}
                                    teamChannels={team.channels}/>
                            ))}
                        </Box>
                </Grid>
            </Grid>
        </Box>
    )

}

export default UserProfile
