import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Typography, Avatar, Stack, Box, Grid, Paper } from '@mui/material';
import Chat from '../../components/Chat/Chat';

const TeamPage = () => {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState(null);

    useEffect(() => {
        const teamRef = ref(db, `teams/${teamId}`);
        const unsubscribe = onValue(teamRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTeamData(data);
            }
        });
        return () => unsubscribe();
    }, [teamId]);

    if (!teamData) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Typography variant="h4" gutterBottom>{teamData.name}</Typography>
            <Grid container spacing={2}>
                {/* Left Side: Chat Box */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom>Team Chat</Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Chat teamId={teamId} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Side: Team Members */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <Avatar alt={teamData.name} src={teamData.avatar} sx={{ width: 100, height: 100 }} />
                        </Stack>
                        <Typography variant="h5" gutterBottom>Team Members</Typography>
                        <Typography component="h1" variant="h6">
                            Owner: {teamData.owner}
                        </Typography>
                        {teamData.owner ? (
                            <ul>
                                {Object.entries(teamData.members).map(([memberId]) => (
                                    <li key={memberId}>
                                        {memberId}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography variant="body1">No members in this team yet.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeamPage;
