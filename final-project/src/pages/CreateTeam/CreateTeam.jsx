import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Box, Typography, TextField, Button, List, ListItem } from "@mui/material";
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import UserCard from "../../components/UserCard/UserCard";
import { createTeam } from "../../services/teams.service";
import { constrains } from "../../common/constraints";

const CreateTeam = () => {

    const { userData } = useContext(AppContext);
    const [data, setData] = useState({});

    const [teamName, setTeamName] = useState('');
    const [searchMember, setSearchMember] = useState('');
    const [teamMembers, setTeamMembers] = useState({});

    const [userList] = useListVals(ref(db, 'users'));

    useEffect(() => {
        if (!userData) return;

        setData({
            ...userData,
            username: userData.username || '',
        });
    }, [userData]);

    const createTeamFunc = async () => {
        if (!teamName || teamName.length < constrains.TEAM_NAME_MIN_LENGTH || teamName.length > constrains.TEAM_NAME_MAX_LENGTH) {
            throw new Error(`Team name must be between ${constrains.TEAM_NAME_MIN_LENGTH} and ${constrains.TEAM_NAME_MAX_LENGTH} characters`);
        }

        try {
            await createTeam(teamName, teamMembers, data.username);
            alert('Team created successfully');
            setTeamName('');
            setTeamMembers({});
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Box sx={{ width: '100%', display: "flex", flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h2' mb={2}>Create Team</Typography>
            <TextField
                id="teamName"
                label="Team Name"
                variant="outlined"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                sx={{ width: '50%', mb: 2 }}
            />

            <TextField
                id="teamName"
                label="Search for members..."
                variant="outlined"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                sx={{ width: '50%' }} />

            <Box sx={{
                width: '50%',
                height: '50vh',
                overflow: 'auto',
                bgcolor: '#CCC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 2
            }}>
                <List sx={{ width: '80%' }}>
                    {userList
                        .filter((user) => user.username !== data.username && user.username.toLowerCase().includes(searchMember))
                        .map((member) => {
                            return (
                                <ListItem key={member.id} sx={{ p: 0, mb: 2 }}>
                                    <UserCard
                                        username={member.username}
                                        firstName={member.firstName}
                                        lastName={member.lastName}
                                        email={member.email}
                                        teamMembers={teamMembers}
                                        setTeamMembers={setTeamMembers} />
                                </ListItem>
                            )
                        })}
                </List>
            </Box>
            <Button variant="contained" color="primary" onClick={createTeamFunc}>Create Team</Button>
        </Box>
    );
}

export default CreateTeam
