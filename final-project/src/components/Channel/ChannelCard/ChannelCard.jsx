import PropTypes from 'prop-types';
import { Box, CardActionArea, Grid, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { ChannelCardActionAreaStyle, ChannelCardUnreadIndicatorStyle } from './ChannelCardStyles';

const ChannelCard = ({ channelName, channelId }) => {

    const { userData } = useContext(AppContext);

    const [channelInfo] = useObjectVal(ref(db, `channels/${channelId}/members`));

    const [channelMessages] = useListVals(ref(db, `channels/${channelId}/messages`));

    const [unreadMessages, setUnreadMessages] = useState([]);


    useEffect(() => {
        if (!channelMessages) return;
        if (!userData) return;
        if (!channelInfo) return;

        const unreadMessages = channelMessages.filter(message => message.timestamp > channelInfo[userData.username].lastAtChannel && 'id' in message);
        setUnreadMessages(unreadMessages);
    }, [channelMessages, channelInfo, userData]);

    const navigate = useNavigate();
    return (
        <CardActionArea 
        component={'div'} 
        onClick={() => navigate(`/channel/${channelId}`)} 
        sx={ChannelCardActionAreaStyle}>

            <Grid container alignItems={'center'}>
                <Grid container 
                item xs={3} 
                alignItems={'center'} 
                justifyContent={'center'} >
                    <TagIcon />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='body2' >
                        {channelName}
                    </Typography>
                </Grid>
                {unreadMessages.length > 0 &&
                    <Grid item xs={3}>
                        <Box sx={ChannelCardUnreadIndicatorStyle}>
                            <Typography 
                            variant='body2' 
                            align='center' 
                            color={'white'}>
                                {unreadMessages.length}
                            </Typography>
                        </Box>
                    </Grid>
                }
            </Grid>
        </CardActionArea>
    )
}

ChannelCard.propTypes = {
    channelName: PropTypes.string.isRequired,
    channelId: PropTypes.string.isRequired
};

export default ChannelCard
