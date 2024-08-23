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
import { editBoxStyle, editModalStyle, editTeamButtonSection } from './EditModalStyle';
import UserCardEditOwner from '../UserCardEditOwner/UserCardEditOwner';
import { changeTeamName, changeTeamOwner } from '../../services/teams.service';


const EditTeamModal = ({ open, toggleModal, teamId }) => {

    const { userData } = useContext(AppContext);

    const [teamMembers] = useObjectVal(ref(db, `teams/${teamId}/members`));
    const [users] = useListVals(ref(db, 'users'));
    const [teamUsers, setTeamUsers] = useState([]);

    const [newOwner, setNewOwner] = useState({});
    console.log(newOwner);
    
    const [searchTeamMember, setSearchTeamMember] = useState('');
    const [newTeamName, setNewTeamName] = useState('');

    useEffect(() => {
        if (!teamMembers) return;
        if (!users) return;
        setTeamUsers(users.filter(user => teamMembers[user.username]));
    }, [teamMembers]);

    const handleTeamEdit = async () => {
        try {
            if (newTeamName) {
                await changeTeamName(teamId, newTeamName);
            }
            if (Object.keys(newOwner).length > 0) {
                await changeTeamOwner(teamId, Object.keys(newOwner)[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={editModalStyle}
            >
                <Box sx={editBoxStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Change Team Name
                    </Typography>

                    <TextField
                        id="changeTeamName"
                        label="Change Team Name..."
                        variant="outlined"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        sx={{ width: '80%' }}
                    />

                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Change Owner
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
                                        <UserCardEditOwner
                                            username={member.username}
                                            firstName={member.firstName}
                                            lastName={member.lastName}
                                            email={member.email}
                                            teamMembers={newOwner}
                                            setTeamMembers={setNewOwner}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </Box>
                    <Box sx={editTeamButtonSection}>
                        <Button variant='contained' onClick={handleTeamEdit}>Edit</Button>
                        <Button variant='contained' onClick={toggleModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

EditTeamModal.propTypes = {
    open: PropTypes.bool,
    toggleModal: PropTypes.func,
    teamId: PropTypes.string,
};

export default EditTeamModal



