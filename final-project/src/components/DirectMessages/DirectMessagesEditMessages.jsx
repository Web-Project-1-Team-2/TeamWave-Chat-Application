import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

import { editDirectMessage } from '../../services/directMessages.service';
import { editMessageBoxStyle, editMessageButtonSection, editMessageModalStyle } from '../Channel/ChannelEditMessages/ChannelEditMessageStyle';
import { notifyError, notifySuccess } from '../../services/notification.service';

const DirectMessagesEditMessages = ({open, toggleModal, chatId, messageId, currMessage}) => {

    const [newMessage, setNewMessage] = useState(currMessage);

    const handleEditMessage = async () => {
        try {
            await editDirectMessage(chatId, messageId, newMessage);
            toggleModal();
            notifySuccess('Message edited successfully');
        } catch (error) {
            console.log(error);
            notifyError('Failed to edit message');
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={editMessageModalStyle}
            >
                <Box sx={editMessageBoxStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Edit Message
                    </Typography>

                    <TextField
                        id="changeTeamName"
                        label="Edit Message"
                        variant="outlined"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{ width: '80%' }}
                    />

                    <Box sx={editMessageButtonSection}>
                        <Button variant='contained' onClick={handleEditMessage}>Edit</Button>
                        <Button variant='contained' onClick={toggleModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

DirectMessagesEditMessages.propTypes = {
    open: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    chatId: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
    currMessage: PropTypes.string.isRequired
};

export default DirectMessagesEditMessages
