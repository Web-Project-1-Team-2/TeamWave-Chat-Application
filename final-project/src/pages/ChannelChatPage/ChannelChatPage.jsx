import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/authContext';
import { Box, Grid, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Chats from '../../components/Chats/Chats';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import ChatDetailsMembers from '../../components/ChatDetailsMembers/ChatDetailsMembers';

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
                <Grid item xs={8.8}>
                    <Typography variant='h4'>{channelData.name}</Typography>
                    <Divider />
                    <Chats id={channelId} />
                </Grid>
                <Grid container item xs={0.2} justifyContent={'end'} sx={{minWidth: 'fit-content'}}>
                    <Divider orientation='vertical' flexItem/>
                </Grid>
                <Grid
                    container
                    item
                    xs={3}
                    direction={'column'}
                    alignItems={'center'}
                    sx={{
                        width: '100%',
                        padding: 1,
                        gap: 2,
                    }}>
                    <Box>
                        <Typography variant='h4'>{channelData.name}</Typography>
                    </Box>
                    <ChatDetailsMembers id={channelId} />
                </Grid>
            </Grid>
        </Box>
    )

}

export default ChannelChatPage
