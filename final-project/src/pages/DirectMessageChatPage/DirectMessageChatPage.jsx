/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/authContext';
import { Avatar, Box, Grid, Typography, Divider, Button } from '@mui/material';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { updateUserLastSeenDirectMessage } from '../../services/directMessages.service';
import ChatsDirectMessages from '../../components/Chat/Chats/ChatsDirectMessages';
import { createDmMeeting } from '../../services/meeting.service';
import { notifyError } from '../../services/notification.service';
import VideocamIcon from '@mui/icons-material/Videocam';
import { channelChatBoxStyling, dmAvatarOnlineIndicator } from '../ChannelChatPage/ChannelChatStyling';
import ChatMedia from '../../components/Chat/ChatMedia/ChatMedia';

const DirectMessageChatPage = () => {

    const { directMessagesId } = useParams();
    const { userData } = useContext(AppContext);

    const [directMessageInfo, loadingDirectMessage] = useObjectVal(ref(db, `directMessages/${directMessagesId}`));

    const [recipientUser, setRecipient] = useState('')
    const [users] = useObjectVal(ref(db, 'users'));

    const [messagesData] = useObjectVal(ref(db, `directMessages/${directMessagesId}/messages`));

    const [meetingUrl, setMeetingUrl] = useState('');

    const navigate = useNavigate();

    const handleMeet = async () => {
        try {
            if (!directMessageInfo) return;

            if (!directMessageInfo.meetings) {
                const newMeetingUrl = await createDmMeeting(directMessagesId);
                console.log(`Meeting created`);
                setMeetingUrl(newMeetingUrl);
                navigate(`/meetDm/${directMessagesId}`);
            } else {
                setMeetingUrl(directMessageInfo.meetings.roomUrl);
                navigate(`/meetDm/${directMessagesId}`);
            }

        } catch (error) {
            console.error(error)
            notifyError('Failed to create meeting');
        }
    }

    useEffect(() => {
        if (!userData) return;

        (async () => {
            try {
                await updateUserLastSeenDirectMessage(directMessagesId, userData?.username);

            } catch (error) {
                console.error(error)
            }
        })()

        return () => {
            (async () => {
                try {
                    await updateUserLastSeenDirectMessage(directMessagesId, userData?.username);
                } catch (error) {
                    console.error(error)
                }
            })()
        }

    }, [messagesData])

    useEffect(() => {
        if (!directMessageInfo) return;
        if (!userData) return;
        if (!users) return;

        const currRecipient = users[Object.keys(directMessageInfo?.members).filter(member => member !== userData?.username)[0]];
        setRecipient(currRecipient);
    }, [directMessageInfo, userData])


    if (loadingDirectMessage) {
        return <div>Loading...</div>
    }

    return (
        <>

            <Box sx={channelChatBoxStyling}>
                <Grid container>
                    <Grid item xs={8.8}>
                        <ChatsDirectMessages id={directMessagesId} />
                    </Grid>
                    <Grid container item xs={0.2} justifyContent={'end'} sx={{ minWidth: 'fit-content' }}>
                        <Divider orientation='vertical' flexItem />
                    </Grid>
                    <Grid
                        container
                        item
                        xs={3}
                        direction={'column'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        sx={{ width: '100%', padding: 1, gap: 2 }}>
                        <Grid container sx={{ width: '100%', gap: '16px' }} direction={'column'} alignItems={'center'}>
                            <Box position={'relative'}>
                                <Avatar
                                    src={recipientUser?.avatar}
                                    sx={{ width: '150px', height: '150px' }}
                                >
                                    {!recipientUser?.avatar && (recipientUser ? recipientUser.username[0].toUpperCase() : 'T')}
                                </Avatar>
                                {recipientUser?.status === "online" &&
                                    <Box position={'absolute'}
                                        bgcolor={'green'}
                                        sx={dmAvatarOnlineIndicator} />
                                }
                            </Box>
                            <Box>
                                <Typography variant='h4'>{recipientUser.username}</Typography>
                            </Box>
                            <Divider sx={{ width: '80%' }} />
                            <Button
                                startIcon={<VideocamIcon />}
                                onClick={handleMeet}
                                variant='contained'
                                color='primary'>
                                Meet
                            </Button>
                            <ChatMedia chatId={directMessagesId} chatType={'directMessages'} />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

DirectMessageChatPage.propTypes = {};

export default DirectMessageChatPage
