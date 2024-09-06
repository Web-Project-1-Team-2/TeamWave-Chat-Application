import PropTypes from 'prop-types';
import { db } from '../../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { Box, CardActionArea, Divider, Grid, Typography } from '@mui/material';
import { ref } from 'firebase/database';
import { useObjectVal } from 'react-firebase-hooks/database';

import TagIcon from '@mui/icons-material/Tag';
import { ubUnreadDmStyling } from '../../DirectMessages/UserBoardUnreadDm/UserBoardUnreadDmStyling';

const UserBoardUnreadChannelMessages = ({ author, text, chatId }) => {

    const [channel] = useObjectVal(ref(db, `channels/${chatId}`));

    const navigate = useNavigate();

    const handleChatClick = () => {
        navigate(`/channel/${chatId}`);
    }

    return (
        <Box width={'90%'}>
            <CardActionArea
                onClick={handleChatClick}
                sx={ubUnreadDmStyling}>
                <Grid container alignItems={'center'}>
                    <Grid container justifyContent={'center'} alignItems={'center'} item xs={2}>
                        <TagIcon sx={{width: '40px', height: '40px'}}/>
                    </Grid>
                    <Grid item xs={10}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}>
                            <Box display={'flex'} alignItems={'end'} gap={2}>
                            <Typography variant='h5'>{channel?.name}</Typography>
                            <Divider orientation='vertical' flexItem />
                            <Typography variant='h5'>{author}</Typography>
                            </Box>
                            <Typography variant='h6'>{text}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardActionArea>
            <Divider variant='middle' />
        </Box>
    )
}

UserBoardUnreadChannelMessages.propTypes = {
    author: PropTypes.string,
    text: PropTypes.string,
    chatId: PropTypes.string,
};

export default UserBoardUnreadChannelMessages
