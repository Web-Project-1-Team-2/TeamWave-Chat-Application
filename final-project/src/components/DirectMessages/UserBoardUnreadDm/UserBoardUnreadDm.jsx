import PropTypes from 'prop-types';
import { db } from '../../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, CardActionArea, Divider, Grid, Typography } from '@mui/material';
import { ref } from 'firebase/database';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ubAvatarIsOnlineStyle, ubUnreadDmStyling } from './UserBoardUnreadDmStyling';

const UserBoardUnreadDm = ({ author, text, chatId }) => {

    const [users] = useObjectVal(ref(db, 'users'));

    const recipientUser = users?.[author];

    const navigate = useNavigate();

    const handleChatClick = () => {
        navigate(`/dm/${chatId}`);
    }

    return (
        <Box width={'90%'}>
            <CardActionArea
                onClick={handleChatClick}
                sx={ubUnreadDmStyling}>
                <Grid container alignItems={'center'}>
                    <Grid container justifyContent={'center'} alignItems={'center'} item xs={2}>
                        <Box position={'relative'}>
                            <Avatar
                                src={recipientUser?.avatar}
                                sx={{ width: '70px', height: '70px' }}
                            >
                                {!recipientUser?.avatar && (recipientUser ? recipientUser.username[0].toUpperCase() : 'T')}
                            </Avatar>
                            {recipientUser?.status === "online" &&
                                <Box position={'absolute'}
                                    bgcolor={'green'}
                                    sx={ubAvatarIsOnlineStyle} />
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={10}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}>
                            <Typography variant='h5'>{author}</Typography>
                            <Typography variant='h6'>{text}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardActionArea>
            <Divider variant='middle' />
        </Box>
    )
}

UserBoardUnreadDm.propTypes = {
    author: PropTypes.string,
    text: PropTypes.string,
    chatId: PropTypes.string,
};

export default UserBoardUnreadDm
