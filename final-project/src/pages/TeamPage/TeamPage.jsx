import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Typography, Avatar, Stack } from '@mui/material';


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
        <div>

            <h1>{teamData.name}</h1>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar alt={teamData.name} src={teamData.avatar} sx={{ width: 100, height: 100 }} />
            </Stack>
            <h2>Team Members</h2>
            <Typography component="h1" variant="h5">
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
                <p>No members in this team yet.</p>
            )}
        </div>
    );
};

export default TeamPage;