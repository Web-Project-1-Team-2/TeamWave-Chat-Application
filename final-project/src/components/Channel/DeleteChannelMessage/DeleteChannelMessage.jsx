import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { editMessageBoxStyle, editMessageButtonSection, editMessageModalStyle } from '../ChannelEditMessages/ChannelEditMessageStyle';
import { deleteChannelMessage, updateUserLastSentMessage } from '../../../services/channel.service';
import { deleteChannelImage } from '../../../services/storage.service';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';

const DeleteChannelMessageModal = ({ open, toggleModal, channelId, messageId, imageInfo }) => {

    const { userData } = useContext(AppContext);

    const [channelMessages] = useListVals(ref(db, `channels/${channelId}/messages`));
    const [userSecondToLastMessage, setUserSecondToLastMessage] = useState(null);

    useEffect(() => {
        if (!channelMessages) return;
        if (!userData) return;

        const userMessages = channelMessages.filter(message => message.author === userData?.username && 'id' in message);
        const secondToLastMessage = userMessages[userMessages.length - 2];
        setUserSecondToLastMessage(secondToLastMessage);
    }, [channelMessages, userData]);

    const handleDeleteMessage = async () => {
        try {
            if (imageInfo) {
                await deleteChannelImage(channelId, imageInfo.name);
            }
            await updateUserLastSentMessage(channelId, userData?.username, userSecondToLastMessage?.id);
            await deleteChannelMessage(channelId, messageId);
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

DeleteChannelMessageModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    channelId: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
    imageInfo: PropTypes.any,
};

export default DeleteChannelMessageModal