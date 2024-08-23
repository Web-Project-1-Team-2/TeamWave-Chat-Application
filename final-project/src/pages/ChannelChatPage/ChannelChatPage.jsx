import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/authContext';
import { Box, Grid, Typography } from '@mui/material';
import Chats from '../../components/Chats/Chats';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';

const ChannelChatPage = () => {

    const { channelId } = useParams();
    const { userData } = useContext(AppContext);
    const [channelData, loadingChannel] = useObjectVal(ref(db, `channels/${channelId}`));

    if (loadingChannel) {
        return <div>Loading...</div>
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container>
                <Grid item xs={8}>
                    <Typography variant='h3'>{channelData.name}</Typography>
                    <Chats id={channelId} />
                </Grid>
                <Grid item xs={4} sx={{borderLeft: '2px solid black'}}>
                    <h1>Members</h1>
                </Grid>
            </Grid>
        </Box>

    )

}

export default ChannelChatPage
