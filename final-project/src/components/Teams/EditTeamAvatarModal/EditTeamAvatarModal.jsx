import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useObjectVal } from 'react-firebase-hooks/database';
import { useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { deleteTeamAvatar, uploadTeamAvatar } from '../../../services/storage.service';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { editTeamAvatarBoxStyle, editTeamAvatarButtonSection, editTeamAvatarStyle } from './EditTeamAvatarStyles';
import { setTeamAvatar } from '../../../services/teams.service';

const EditTeamAvatarModal = ({ open, toggle, teamId, teamName }) => {

    const [newAvatar, setNewAvatar] = useState(null);
    const [fileNewAvatar, setFileNewAvatar] = useState(null);

    const [currTeam] = useObjectVal(ref(db, `teams/${teamId}`));

    const handleChangeAvatar = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewAvatar(e.target.result);
            };
            reader.readAsDataURL(file);
        }

        setFileNewAvatar(file);
    }

    const changeTeamAvatar = async () => {
        try {
            if (currTeam?.avatar) {
                await deleteTeamAvatar(teamId, teamName);
            }

            const avatarUrl = await uploadTeamAvatar(fileNewAvatar, teamId, teamName);
            await setTeamAvatar(teamId, avatarUrl);
            toggle();
            notifySuccess('Team avatar changed successfully');
        } catch (error) {
            console.log(error);
            notifyError('Failed to change team avatar');
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={toggle}
                aria-labelledby="modal-change-avatar"
                sx={editTeamAvatarStyle}
            >
                <Box sx={editTeamAvatarBoxStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Change Team Avatar
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Avatar
                            src={newAvatar}
                            alt={currTeam?.name}
                            sx={{ width: 200, height: 200, mr: 2 }}
                        />

                        <Button variant="contained" component="label" >
                            Upload Team Avatar
                            <input type="file" hidden accept="image/*" onChange={handleChangeAvatar} />
                        </Button>
                    </Box>

                    <Box sx={editTeamAvatarButtonSection}>
                        <Button variant='contained' onClick={changeTeamAvatar}>Edit</Button>
                        <Button variant='contained' onClick={toggle}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )

};

EditTeamAvatarModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    teamName: PropTypes.string.isRequired,
};

export default EditTeamAvatarModal
