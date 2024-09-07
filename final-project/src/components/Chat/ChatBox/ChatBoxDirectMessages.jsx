import PropTypes from 'prop-types';
import { Avatar, Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import { ref } from 'firebase/database';
import moment from 'moment';
import { useObjectVal } from 'react-firebase-hooks/database';
import { db } from '../../../config/firebase-config';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectMessagesEditMessages from '../../DirectMessages/DirectMessagesEditMessages';
import DirectMessagesDeleteMessages from '../../DirectMessages/DirectMessagesDeleteMessages/DirectMessagesDeleteMessages';
import { chatBoxAvatarIsOnlineStyling, chatBoxAvatarStyling, chatBoxMessageEditMenuStyling, chatBoxMessageStyling, chatBoxPaperStyling, chatBoxStyling } from './chatBox';

const ChatBoxDirectMessages = ({ text, username, image, timestamp, isCurrUser, messageId, chatId }) => {

    const flexDir = isCurrUser ? 'row-reverse' : 'row';

    const flexAlign = isCurrUser ? 'flex-end' : 'flex-start';

    const { userData } = useContext(AppContext);

    const [currDirectMessage] = useObjectVal(ref(db, `directMessages/${chatId}`));

    const [currUserInDirectMessage, setCurrUserInDirectMessage] = useState({});

    const [userInformation, loading] = useObjectVal(ref(db, `users/${username}`));

    const [editSection, setEditSection] = useState(false);
    const toggleEditSection = () => setEditSection(!editSection);

    const [editModal, setEditModal] = useState(false);
    const toggleEditModal = () => setEditModal(!editModal);

    const [deleteModal, setDeleteModal] = useState(false);
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);

    useEffect(() => {
        if (!currDirectMessage) return;
        if (!userData) return;

        if (userData.username in currDirectMessage.members) {
            setCurrUserInDirectMessage(currDirectMessage.members[userData.username]);
        }
    }, [currDirectMessage, userData]);


    const timeAgoUsingMoment = (date) => {
        return moment(date).fromNow();
    }

    const timeAgo = timeAgoUsingMoment(timestamp);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Box
                onMouseEnter={toggleEditSection}
                onMouseLeave={toggleEditSection}
                sx={{ ...chatBoxStyling, flexDirection: flexDir }}>
                <Box position={'relative'} sx={{ height: '45px', width: '45px' }}>
                    <Avatar
                        alt="Sender Avatar"
                        src={userInformation?.avatar}
                        sx={chatBoxAvatarStyling}/>
                    {userInformation?.status === 'online' &&
                        <Box
                            position={'absolute'}
                            bgcolor={'green'}
                            sx={chatBoxAvatarIsOnlineStyling} />
                    }
                </Box>
                <Box sx={{ ...chatBoxMessageStyling, alignItems: flexAlign}}>
                    <Typography variant='h6'>{username}</Typography>
                    {image &&
                        <img src={image?.url} alt='Sent Image' style={{ maxWidth: '40%', borderRadius: '15px' }} />
                    }
                    <Box display={'flex'} flexDirection={flexDir} sx={{ gap: 2 }}>
                        {text !== '' &&
                            <Paper sx={{...chatBoxPaperStyling, bgcolor: isCurrUser ? 'primary.main' : 'background.paper'}}>
                                <Grid item>
                                    <Typography variant='subtitle1'>{text}</Typography>
                                </Grid>
                            </Paper>
                        }
                        {(currUserInDirectMessage.lastSentMessage === messageId && editSection) &&
                            <Box sx={chatBoxMessageEditMenuStyling}>
                                <IconButton onClick={toggleDeleteModal}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={toggleEditModal}>
                                    <EditIcon />
                                </IconButton>
                            </Box>
                        }
                    </Box>
                    <Typography component={'p'} variant='body2'>{timeAgo}</Typography>
                </Box>
            </Box >

            {editModal &&
                <DirectMessagesEditMessages
                    open={editModal}
                    toggleModal={toggleEditModal}
                    messageId={messageId}
                    chatId={chatId}
                    currMessage={text} />
            }
            {deleteModal &&
                <DirectMessagesDeleteMessages
                    open={deleteModal}
                    toggleModal={toggleDeleteModal}
                    messageId={messageId}
                    chatId={chatId}
                    imageInfo={image} />
            }
        </>

    )
}

ChatBoxDirectMessages.propTypes = {
    text: PropTypes.string,
    username: PropTypes.string,
    timestamp: PropTypes.number,
    isCurrUser: PropTypes.bool,
    image: PropTypes.any,
    messageId: PropTypes.string,
    chatId: PropTypes.string,
};

export default ChatBoxDirectMessages