import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Typography, Avatar, Box, Grid, Button } from '@mui/material';
import { useListVals } from 'react-firebase-hooks/database';
import TeamUserCard from '../../components/TeamUserCard/TeamUserCard';
import { AppContext } from '../../context/authContext';
import AddTeamMemberModal from '../../components/AddTeamMemberModal/AddTeamMemberModal';

const TeamPage = () => {

    const { userData } = useContext(AppContext);

    const { teamId } = useParams();

    const [teamData, setTeamData] = useState(null);

    const [teamMembersData, setTeamMembers] = useState([]);
    const [teamMembers] = useListVals(ref(db, `users`));

    const [addModal, setAddModal] = useState(false);
    const toggleAddModal = () => setAddModal(!addModal);


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

    useEffect(() => {
        if (!teamMembers) return;
        const includedMembers = teamMembers.filter((member) => teamData?.members[member.username]);
        setTeamMembers(includedMembers);
    }, [teamData, teamMembers]);

    if (!teamData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="h2" gutterBottom>{teamData.name}</Typography>
                <Grid container spacing={2} direction={'row'}>
                    <Grid item xs={8}>
                        <Grid container direction={'column'}>
                            <Grid item xs={12}>
                                <Avatar alt={teamData.name} src={teamData.avatar} sx={{ width: 200, height: 200 }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component="h5" variant="h5">
                                    Owner: {teamData.owner}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container direction={'column'}>
                            <Grid item xs={12}>
                                <Grid container mb={2} spacing={2}>
                                    <Grid item xs={6}>
                                        {teamData.owner === userData?.username &&
                                            <Button
                                                variant='contained'
                                                sx={{ width: '100%' }}
                                                onClick={toggleAddModal}>Add</Button>
                                        }
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant='contained'
                                            sx={{ width: '100%' }}
                                        >Leave</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {teamMembersData.map(member => <TeamUserCard
                                    key={member.uid}
                                    avatar={member.avatar}
                                    username={member.username}
                                    id={member.uid}
                                    owner={teamData.owner}
                                    teamId={teamId}
                                />)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {addModal &&
                <AddTeamMemberModal open={addModal} toggleModal={toggleAddModal} teamId={teamId}/>
            }
        </>
    );
};

export default TeamPage;


{/* <Grid item xs={12} md={6}>
<Paper elevation={3} sx={{ padding: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
    <Typography variant="h5" gutterBottom>Team Chat</Typography>
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Chat teamId={teamId} />
    </Box>
</Paper>
</Grid> */}

{/* <Grid container spacing={2}>
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
</Grid> */}


// const [newMemberName, setNewMemberName] = useState('');
// const handleAddMember = () => {
//     if (newMemberName.trim() !== '') {
//         const newMemberRef = ref(db, `teams/${teamId}/members/`);
//         update(newMemberRef, { [newMemberName]: true })
//             .then(() => {
//                 console.log(`New member ${newMemberName} added successfully`);
//                 setNewMemberName('');
//             })
//             .catch((error) => {
//                 console.error('Error adding new member:', error);
//             });
//     }
// };