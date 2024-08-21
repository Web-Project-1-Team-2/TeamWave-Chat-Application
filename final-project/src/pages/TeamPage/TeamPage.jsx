import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Typography, Avatar, Stack, Box, Grid, Paper, Button } from '@mui/material';
import Chat from '../../components/Chat/Chat';

const TeamPage = () => {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState(null);
    const [newMemberName, setNewMemberName] = useState('');

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

    const handleAddMember = () => {
        if (newMemberName.trim() !== '') {
            const newMemberRef = ref(db, `teams/${teamId}/members/`);
            update(newMemberRef, { [newMemberName]: true })
                .then(() => {
                    console.log(`New member ${newMemberName} added successfully`);
                    setNewMemberName('');
                })
                .catch((error) => {
                    console.error('Error adding new member:', error);
                });
        }
    };

    const handleDeleteMember = (memberName) => {
        const memberRef = ref(db, `teams/${teamId}/members/${memberName}`);
        remove(memberRef)
            .then(() => {
                console.log(`Member ${memberName} deleted successfully`);
            })
            .catch((error) => {
                console.error('Error deleting member:', error);
            });
    };
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <input
                                type="text"
                                placeholder="New member name"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                style={{ marginRight: '1rem' }}
                            />
                            <Button variant="contained" size="small" onClick={handleAddMember} >
                                Add
                            </Button>
                        </Box>

                        {teamData.owner ? (
                            <ul>
                                {Object.entries(teamData.members).map(([memberId, memberData]) => (
                                    <li key={memberId} style={{ marginBottom: '10px' }}>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                {memberId}
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" size="small" onClick={() => handleDeleteMember(memberId)}>
                                                    Delete
                                                </Button>
                                            </Grid>
                                        </Grid>
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
