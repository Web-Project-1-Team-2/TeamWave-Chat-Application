import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import {  deleteDirectMessageImage } from '../../../services/storage.service';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { deleteDirectMessage, updateLastSentDirectMessage } from '../../../services/directMessages.service';
import { editMessageBoxStyle, editMessageButtonSection, editMessageModalStyle } from '../../Channel/ChannelEditMessages/ChannelEditMessageStyle';

const DirectMessagesDeleteMessages = ({ open, toggleModal, chatId, messageId, imageInfo }) => {

    const { userData } = useContext(AppContext);

    console.log(chatId);
    console.log(messageId);
    
    

    const [directMessages] = useListVals(ref(db, `directMessages/${chatId}/messages`));
    const [userSecondToLastMessage, setUserSecondToLastMessage] = useState(null);

    useEffect(() => {
        if (!directMessages) return;
        if (!userData) return;

        const userMessages = directMessages.filter(message => message.author === userData?.username && 'id' in message);
        if(userMessages[userMessages.length - 2] !== undefined) {
            setUserSecondToLastMessage(userMessages[userMessages.length - 2]);
        } else {
            setUserSecondToLastMessage(null);
        }
        
    }, [directMessages, userData]);

    const handleDeleteMessage = async () => {
        try {
            if (imageInfo) {
                await deleteDirectMessageImage(chatId, imageInfo.name);
            }
            await updateLastSentDirectMessage(chatId, userData?.username, userSecondToLastMessage?.id);
            await deleteDirectMessage(chatId, messageId);
            toggleModal();
            notifySuccess('Message deleted successfully');
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
                        Are you sure you want to delete this message?
                    </Typography>

                    <Box sx={editMessageButtonSection}>
                        <Button variant='contained' onClick={handleDeleteMessage}>Delete</Button>
                        <Button variant='contained' onClick={toggleModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

DirectMessagesDeleteMessages.propTypes = {
    open: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    chatId: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
    imageInfo: PropTypes.any,
};

export default DirectMessagesDeleteMessages
