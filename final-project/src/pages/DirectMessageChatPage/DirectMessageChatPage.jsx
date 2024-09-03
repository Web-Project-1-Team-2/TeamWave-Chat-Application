/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/authContext';
import { Avatar, Box, Grid, Typography, Divider } from '@mui/material';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { updateUserLastSeenDirectMessage } from '../../services/directMessages.service';
import ChatsDirectMessages from '../../components/Chat/Chats/ChatsDirectMessages';

const DirectMessageChatPage = () => {

    const { directMessagesId } = useParams();
    const { userData } = useContext(AppContext);

    console.log(directMessagesId);


    const [directMessageInfo, loadingDirectMessage] = useObjectVal(ref(db, `directMessages/${directMessagesId}`));

    const [recipientUser, setRecipient] = useState('')
    const [users] = useObjectVal(ref(db, 'users'));

    const [messagesData] = useObjectVal(ref(db, `directMessages/${directMessagesId}/messages`));


    // const navigate = useNavigate();

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

        const currRecipient = users[Object.keys(directMessageInfo?.members).filter(member => member !== userData?.username)[0]];
        setRecipient(currRecipient);
    }, [directMessageInfo, userData])


    if (loadingDirectMessage) {
        return <div>Loading...</div>
    }

    return (
        <>

            <Box sx={{ width: '100%' }}>
                <Grid container>
                    <Grid item xs={8.8}>
                        <Divider />
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
                        sx={{
                            width: '100%',
                            padding: 1,
                            gap: 2,
                        }}>
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
                                        sx={{
                                            borderRadius: '50%',
                                            width: '30px',
                                            height: '30px',
                                            zIndex: 1500,
                                            right: '17px',
                                            bottom: '-2px',
                                        }} />
                                }
                            </Box>
                            <Box>
                                <Typography variant='h4'>{recipientUser.username}</Typography>
                            </Box>
                            <Divider sx={{width: '80%'}}  />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

DirectMessageChatPage.propTypes = {};

export default DirectMessageChatPage
