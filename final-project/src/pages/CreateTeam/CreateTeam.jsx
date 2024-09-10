import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Box, Typography, TextField, Button, List, ListItem, Avatar, Divider } from "@mui/material";
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import UserCard from "../../components/User/UserCard/UserCard";
import { createTeam } from "../../services/teams.service";
import { constrains } from "../../common/constraints";
import { notifyError, notifySuccess } from "../../services/notification.service";
import { createTeamStyling, addMembersStyling } from "./CreateTeamStyling";

const CreateTeam = () => {
    const { userData } = useContext(AppContext);

    const [data, setData] = useState({});

    const [teamName, setTeamName] = useState('');
    const [searchMember, setSearchMember] = useState('');

    const [teamMembers, setTeamMembers] = useState({});

    const [userList] = useListVals(ref(db, 'users'));

    const [teamAvatar, setTeamAvatar] = useState(null);
    const [currAvatar, setCurrAvatar] = useState(null);


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
            await createTeam(teamName, teamMembers, data.username, teamAvatar);
            notifySuccess('Team created successfully');
            setTeamName('');
            setTeamMembers({});
            setTeamAvatar(null);
            setCurrAvatar(null);
        } catch (error) {
            console.log(error);
            notifyError('Failed to create team');
        }
    }

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrAvatar(e.target.result);
            };
            reader.readAsDataURL(file);
        }

        setTeamAvatar(file);
    };

    return (
        <Box sx={createTeamStyling}>
            <Box sx={{ width: '100%', mb: 2 }}>

                <Divider textAlign='left' variant="middle" flexItem>
                    <Typography variant='h2' alignSelf={'flex-start'}>Create Team</Typography>
                </Divider>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    src={currAvatar}
                    sx={{ width: 130, height: 130, mr: 2 }}>
                    {!teamAvatar && (teamName ? teamName[0].toUpperCase() : 'T')}
                </Avatar>
                <Button variant="contained" component="label">
                    Upload Team Avatar
                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                </Button>
            </Box>

            <TextField
                id="teamName"
                label="Team Name"
                variant="outlined"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                sx={{ width: '50%' }}
            />
            <TextField
                id="searchMember"
                label="Search for members..."
                variant="outlined"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                sx={{ width: '50%' }}
            />
            <Box sx={addMembersStyling}>
                <List sx={{ width: '80%' }}>
                    {userList
                        .filter((user) => user.username !== data.username && user.username.toLowerCase().includes(searchMember.toLowerCase()))
                        .map((member) => (
                            <ListItem key={member.uid} sx={{ p: 0, mb: 2 }}>
                                <UserCard
                                    username={member.username}
                                    firstName={member.firstName}
                                    lastName={member.lastName}
                                    email={member.email}
                                    teamMembers={teamMembers}
                                    setTeamMembers={setTeamMembers}
                                />
                            </ListItem>
                        ))}
                </List>
            </Box>
            <Button variant="contained" color="primary" onClick={createTeamFunc}>Create Team</Button>
        </Box>
    );
}

export default CreateTeam;