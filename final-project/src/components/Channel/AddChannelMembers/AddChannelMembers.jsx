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
import { boxStyle, buttonSectionStyle, modalStyle } from '../../Teams/AddTeamMemberModal/AddMemberStyles';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { addMemberToChannel, addChannelToMember } from '../../../services/channel.service';

const AddChannelMembers = ({ open, toggleModal, channelId, teamId }) => {

    const { userData } = useContext(AppContext);

    const [teamMembers] = useObjectVal(ref(db, `teams/${teamId}/members`));
    const [userList] = useListVals(ref(db, 'users'));
    const [teamMembersState, setTeamMembersState] = useState([]);

    const [searchMember, setSearchMember] = useState('');

    const [newChannelMembers, setNewChannelMembers] = useState({});
    

    useEffect(() => {
        if (!teamMembers) return;
        if(!userList) return;

        const members = Object.keys(teamMembers);
        const teamMembersData = userList.filter((user) => {
            // 'teams' in user ? 
            // (teamId in user.teams && userData.username !== user.username && members.includes(user.username)) : 
            // false

            if(!('teams' in user)) {
                console.log('no teams');
                return false;
            }

            if(!(teamId in user.teams)) {
                console.log('no team');
                return false;
            }

            if(userData.username === user.username) {
                console.log('same user');
                return false;
            }

            if(!members.includes(user.username)) {
                console.log('not in members');
                return false;
            }

            if(channelId in user.channels) {
                console.log('in channel');
                return false;
            }

            return true;
        })
        console.log(teamMembersData);
        
        setTeamMembersState([...teamMembersData]);
    }, [userList, teamMembers]);


    const handleAddMembers = async () => {

        const newMembers = Object.keys(newChannelMembers);

        try {
            if(Object.keys(newMembers).length === 0) {
                throw new Error('No users selected');
            }

            await Promise.all(newMembers.map(username => addMemberToChannel(channelId, username)));
            await Promise.all(newMembers.map(username => addChannelToMember(channelId, username)));
            toggleModal();
            notifySuccess('Users added to channel successfully');
        } catch (error) {
            notifyError(error.message);
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
                        bgcolor: '#CCC',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        {teamMembersState.length === 0 ? 
                        <Typography variant='h6'>No members found</Typography> :
                        (<List sx={{ width: '80%' }}>
                            {teamMembersState
                                .filter((user) => user.username.toLowerCase().includes(searchMember.toLowerCase()))
                                .map((member) => (
                                    <ListItem key={member.uid} sx={{ p: 0, mb: 2 }}>
                                        <UserCard
                                            username={member.username}
                                            firstName={member.firstName}
                                            lastName={member.lastName}
                                            email={member.email}
                                            teamMembers={newChannelMembers}
                                            setTeamMembers={setNewChannelMembers}
                                        />
                                    </ListItem>
                                ))}
                        </List>)}
                    </Box>
                    <Box sx={buttonSectionStyle}>
                        <Button variant='contained' onClick={handleAddMembers}>Add</Button>
                        <Button variant='contained' onClick={toggleModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

AddChannelMembers.propTypes = {
    open: PropTypes.bool,
    toggleModal: PropTypes.func,
    channelId: PropTypes.string,
    teamId: PropTypes.string,
};

export default AddChannelMembers
