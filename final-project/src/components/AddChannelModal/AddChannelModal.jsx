import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { AppContext } from '../../context/authContext';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { Button } from '@mui/material';
import UserCard from '../UserCard/UserCard';
import { boxStyle, buttonSectionStyle, modalStyle } from '../AddTeamMemberModal/AddMemberStyles';
import { createChannel } from '../../services/channel.service';

const AddChatModal = ({open, toggleModal, teamId}) => {

    const { userData } = useContext(AppContext);

    const [teamMembers] = useObjectVal(ref(db, `teams/${teamId}/members`));
    const [users] = useListVals(ref(db, 'users'));
    const [teamUsers, setTeamUsers] = useState([]);

    const [channelMembers, setChannelMembers] = useState({});

    const [searchTeamMember, setSearchTeamMember] = useState('');
    const [channelName, setChannelName] = useState('');

    useEffect(() => {
        if (!teamMembers) return;
        if (!users) return;
        setTeamUsers(users.filter(user => teamMembers[user.username]));
    }, [teamMembers]);


    const handleCreateChannel = async () => {
        if(!channelName) {
            alert('Please enter a channel name');
            return;
        }
        if(Object.keys(channelMembers).length === 0) {
            alert('Please add at least one member to the channel');
            return;
        }

        try {
            await createChannel(teamId, channelName, channelMembers, userData.username);
            toggleModal();
        } catch (error) {
            console.error(error);
        }
    }

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
                        Channel Name:
                    </Typography>

                    <TextField
                        id="changeTeamName"
                        label="Change Team Name..."
                        variant="outlined"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        sx={{ width: '80%' }}
                    />

                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Choose Members
                    </Typography>

                    <TextField
                        id="searchMember"
                        label="Search for members..."
                        variant="outlined"
                        value={searchTeamMember}
                        onChange={(e) => setSearchTeamMember(e.target.value)}
                        sx={{ width: '80%' }}
                    />

                    <Box sx={{
                        width: '80%',
                        height: '50vh',
                        overflow: 'auto',
                        bgcolor: '#CCC',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <List sx={{ width: '80%' }}>
                            {teamUsers
                                .filter((user) => user.username !== userData?.username && user.username.toLowerCase().includes(searchTeamMember.toLowerCase()))
                                .map((member) => (
                                    <ListItem key={member.id} sx={{ p: 0, mb: 2 }}>
                                        <UserCard
                                            username={member.username}
                                            firstName={member.firstName}
                                            lastName={member.lastName}
                                            email={member.email}
                                            teamMembers={channelMembers}
                                            setTeamMembers={setChannelMembers}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </Box>
                    <Box sx={buttonSectionStyle}>
                        <Button variant='contained' onClick={handleCreateChannel}>Create</Button>
                        <Button variant='contained' onClick={toggleModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

AddChatModal.propTypes = {
    open: PropTypes.bool,
    toggleModal: PropTypes.func,
    teamId: PropTypes.string,
};

export default AddChatModal
