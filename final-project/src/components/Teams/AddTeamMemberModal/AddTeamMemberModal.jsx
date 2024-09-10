/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import UserCard from '../../User/UserCard/UserCard';
import { AppContext } from '../../../context/authContext';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { Button } from '@mui/material';
import { addTeamToUser, addUsersToTeam } from '../../../services/teams.service';
import { boxStyle, buttonSectionStyle, modalStyle } from './AddMemberStyles';
import { notifyError, notifySuccess } from '../../../services/notification.service';

const AddTeamMemberModal = ({ open, toggleModal, teamId }) => {

    const { userData } = useContext(AppContext);
    const [searchMember, setSearchMember] = useState('');
    const [newTeamMembers, setNewTeamMembers] = useState({});


    const [addedTeamMembers] = useObjectVal(ref(db, `teams/${teamId}/members`));
    const [userList] = useListVals(ref(db, 'users'));
    const [notAddedMembers, setNotAddedMembers] = useState([]);

    const [data, setData] = useState({});

    useEffect(() => {
        if (!userData) return;
        setData({
            ...userData,
            username: userData.username || '',
        });
    }, [userData]);

    useEffect(() => {
        if (!userList) return;
        if (!addedTeamMembers) return;
        const notAdded = userList.filter(user => !addedTeamMembers[user.username]);
        setNotAddedMembers([...notAdded]);
    }, [addedTeamMembers]);


    const addUsers = async () => {
        const users = Object.keys(newTeamMembers);
        if (users.length === 0) {
            throw new Error('No users selected');
        }

        try {
            await Promise.all(users.map(username => addTeamToUser(username, teamId)));
            await Promise.all(users.map(username => addUsersToTeam(teamId, username)));
            notifySuccess('Users added to team successfully');
            setNewTeamMembers({});
            setSearchMember('');
            toggleModal();
        } catch (error) {
            console.log(error);
            notifyError('Failed to add users to team');
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={modalStyle}
            >
                <Box sx={boxStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Add Team Member
                    </Typography>

                    <TextField
                        id="searchMember"
                        label="Search for members..."
                        variant="outlined"
                        value={searchMember}
                        onChange={(e) => setSearchMember(e.target.value)}
                        sx={{ width: '80%' }}
                    />
                    <Box sx={{
                        width: '80%',
                        maxHeight: '50vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2,
                        border: 3,
                        borderColor: 'divider',
                    }}>
                        <List sx={{ width: '80%' }}>
                            {notAddedMembers
                                .filter((user) => user.username !== data.username && user.username.toLowerCase().includes(searchMember.toLowerCase()))
                                .map((member) => (
                                    <ListItem key={member.uid} sx={{ p: 0, mb: 2 }}>
                                        <UserCard
                                            username={member.username}
                                            firstName={member.firstName}
                                            lastName={member.lastName}
                                            email={member.email}
                                            teamMembers={newTeamMembers}
                                            setTeamMembers={setNewTeamMembers}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </Box>
                    <Box sx={buttonSectionStyle}>
                        <Button variant='contained' onClick={addUsers}>Add</Button>
                        <Button variant='contained' onClick={toggleModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

AddTeamMemberModal.propTypes = {
    open: PropTypes.bool,
    toggleModal: PropTypes.func,
    teamId: PropTypes.string,
};

export default AddTeamMemberModal



