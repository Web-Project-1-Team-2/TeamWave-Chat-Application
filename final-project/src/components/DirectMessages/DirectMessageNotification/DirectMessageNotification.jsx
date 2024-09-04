import { Avatar, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const DirectMessageNotification = ({ avatar, author, text, dmId }) => {

    const navigate = useNavigate();

    return (
        <Box display={'flex'} onClick={() => navigate(`/dm/${dmId}`)}>
            <Box>
                <Avatar
                    src={avatar}
                    sx={{ width: '50px', height: '50px', mr: 2 }}
                >
                    {!avatar && author[0].toUpperCase()}
                </Avatar>
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
                <Typography variant='h6'>{author}</Typography>
                <Typography variant='body1'>{text}</Typography>
            </Box>
        </Box>
    )
}

DirectMessageNotification.propTypes = {
    avatar: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
    dmId: PropTypes.string,
};

export default DirectMessageNotification
