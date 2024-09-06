/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/authContext';
import { Box, Button, Grid, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Chats from '../../components/Chat/Chats/Chats';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import ChatDetailsMembers from '../../components/Chat/ChatDetailsMembers/ChatDetailsMembers';
import { notifyError, notifySuccess } from '../../services/notification.service';
import { leaveChannel, updateLastSeen } from '../../services/channel.service';
import AddChannelMembers from '../../components/Channel/AddChannelMembers/AddChannelMembers';
import { createMeeting } from '../../services/meeting.service';

const ChannelChatPage = () => {

    const { channelId } = useParams();
    const { userData } = useContext(AppContext);
    const [channelData, loadingChannel] = useObjectVal(ref(db, `channels/${channelId}`));
    const [messagesData] = useObjectVal(ref(db, `channels/${channelId}/messages`));

    const [addMembersModal, setAddMembersModal] = useState(false);
    const toggleAddMembersModal = () => setAddMembersModal(!addMembersModal);

    const navigate = useNavigate();

    const [meetingUrl, setMeetingUrl] = useState('');
    console.log(meetingUrl);


    const leaveCurrChannel = async () => {
        const membersArr = Object.keys(channelData.members);
        try {

            if (membersArr.length === 1) {
                notifyError('You are the only member in this channel, you should add more members before leaving');
                toggleAddMembersModal();
            }

            await leaveChannel(channelId, userData?.username);
            notifySuccess('Channel left successfully');
            navigate('/');
        } catch (error) {
            console.error(error)
            notifyError('Failed to leave channel');
        }
    }

    const handleMeet = async () => {
        try {
            if(!channelData) return;

            if(!channelData.meetings) {
                const newMeetingUrl = await createMeeting(channelId);
                console.log(`Meeting created`);
                setMeetingUrl(newMeetingUrl);
                navigate(`/meet/${channelId}`);
            } else {
                setMeetingUrl(channelData.meetings.roomUrl);
                navigate(`/meet/${channelId}`);
            }

        } catch (error) {
            console.error(error)
            notifyError('Failed to create meeting');
        }

    }

    useEffect(() => {
        if (!channelData) return;
        if (!userData) return;

        if (channelData.meetings) {
            console.log(channelData.meetings.roomUrl);
            setMeetingUrl(channelData.meetings.roomUrl);
        }
    }, [channelData, userData])

    useEffect(() => {
        if (!messagesData) return;
        if (!userData) return;

        (async () => {
            try {
                await updateLastSeen(channelId, userData?.username);
            } catch (error) {
                console.error(error)
            }
        })()

        return () => {
            (async () => {
                try {
                    await updateLastSeen(channelId, userData?.username);
                } catch (error) {
                    console.error(error)
                }
            })()
        }

    }, [messagesData])

    if (loadingChannel) {
        return <div>Loading...</div>
    }

    return (
        <>

            <Box sx={{ width: '100%' }}>
                <Grid container>
                    <Grid item xs={8.8}>
                        <Box>
                        <Typography variant='h4'>{channelData.name}</Typography>
                        <Button onClick={handleMeet} variant='contained'>Meet</Button>
                        </Box>
                        <Divider />
                        <Chats id={channelId} />
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
                        sx={{
                            width: '100%',
                            padding: 1,
                            gap: 2,
                        }}>
                        <Grid container sx={{ width: '100%' }} justifyContent={'center'}>
                            <Box>
                                <Typography variant='h4'>{channelData.name}</Typography>
                            </Box>
                            <ChatDetailsMembers id={channelId} />
                        </Grid>

                        <Grid container direction={'column'} alignItems={'center'} sx={{ width: '100%', gap: 2 }}>
                            <Button onClick={toggleAddMembersModal} variant='contained' sx={{ width: 150 }}>
                                Add Members
                            </Button>
                            <Button onClick={leaveCurrChannel} color='error' variant='contained' sx={{ width: 150 }}>
                                Leave Channel
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {addMembersModal &&
                <AddChannelMembers
                    open={addMembersModal}
                    toggleModal={toggleAddMembersModal}
                    channelId={channelId}
                    teamId={channelData?.teamId}
                />
            }
        </>
    )

}

export default ChannelChatPage
