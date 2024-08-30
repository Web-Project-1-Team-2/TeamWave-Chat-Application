import { Avatar, Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import { ref } from 'firebase/database';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useObjectVal } from 'react-firebase-hooks/database';
import { db } from '../../../config/firebase-config';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChannelEditMessages from '../../Channel/ChannelEditMessages/ChannelEditMessages';
import DeleteChannelMessageModal from '../../Channel/DeleteChannelMessage/DeleteChannelMessage';

const ChatBox = ({ text, username, image, timestamp, isCurrUser, messageId, chatId }) => {

    const flexDir = isCurrUser ? 'row-reverse' : 'row';

    const { userData } = useContext(AppContext);

    const [currChannel] = useObjectVal(ref(db, `channels/${chatId}`));

    const [currUserInChannel, setCurrUserInChannel] = useState({});

    const [userInformation, loading] = useObjectVal(ref(db, `users/${username}`));

    const [editSection, setEditSection] = useState(false);
    const toggleEditSection = () => setEditSection(!editSection);

    const [editModal, setEditModal] = useState(false);
    const toggleEditModal = () => setEditModal(!editModal);

    const [deleteModal, setDeleteModal] = useState(false);
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);

    useEffect(() => {
        if (!currChannel) return;
        if (!userData) return;

        if (userData.username in currChannel.members) {
            setCurrUserInChannel(currChannel.members[userData.username]);
        }
    }, [currChannel, userData]);


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
                sx={{
                    maxWidth: '75%',
                    minWidth: '25%',
                    width: 'fit-content',
                    padding: '8px',
                    margin: '8px',
                    borderRadius: '15px',
                    display: 'flex',
                    gap: '8px',
                    flexDirection: flexDir,
                }}>
                <Box position={'relative'} sx={{ height: '45px', width: '45px' }}>
                    <Avatar
                        alt="Sender Avatar"
                        src={userInformation?.avatar}
                        sx={{
                            width: 45,
                            height: 45,
                            borderRadius: '50%',
                        }}
                    />
                    {userInformation?.status === 'online' &&
                        <Box
                            position={'absolute'}
                            bgcolor={'green'}
                            sx={{
                                borderRadius: '50%',
                                width: '15px',
                                height: '15px',
                                zIndex: 1500,
                                right: '1px',
                                bottom: '-2px',
                            }
                            } />
                    }
                </Box>

                <Grid container spacing={1}>
                    <Grid container direction={'column'} item xs={12} alignItems={isCurrUser ? 'flex-end' : 'flex-start'}>
                        {image &&
                            <img src={image?.url} alt='Sent Image' style={{ maxWidth: '40%', borderRadius: '15px' }} />
                        }
                        {text !== '' &&
                            <Paper sx={{
                                padding: '8px',
                                borderRadius: '15px',
                            }}>
                                <Grid item>
                                    <Grid container justifyContent='flex-start' alignItems='center' sx={{ gap: '8px' }} >
                                        <Typography variant='h6'>{username}</Typography>
                                        <Typography component={'p'} variant='body2'>{timeAgo}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography variant='body1'>{text}</Typography>
                                </Grid>
                            </Paper>
                        }
                    </Grid>
                </Grid>
                {(currUserInChannel.lastSentMessage === messageId && editSection) &&
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton onClick={toggleDeleteModal}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={toggleEditModal}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                }
            </Box >
            {editModal &&
                <ChannelEditMessages
                    open={editModal}
                    toggleModal={toggleEditModal}
                    messageId={messageId}
                    channelId={chatId}
                    currMessage={text} />
            }
            {deleteModal &&
                <DeleteChannelMessageModal 
                open={deleteModal} 
                toggleModal={toggleDeleteModal} 
                messageId={messageId} 
                channelId={chatId} 
                imageInfo={image}/>
            }
        </>

    )
}

ChatBox.propTypes = {
    text: PropTypes.string,
    username: PropTypes.string,
    timestamp: PropTypes.number,
    isCurrUser: PropTypes.bool,
    image: PropTypes.any,
    messageId: PropTypes.string,
    chatId: PropTypes.string,
};

export default ChatBox

//const options = { hour: '2-digit', minute: '2-digit', hour12: false };
//new Date(timestamp).toLocaleTimeString([], options)