import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import { useNavigate } from 'react-router-dom';

const ChannelMessageNotification = ({ author, channelName, text, channelId }) => {

    const navigate = useNavigate();

    return (
        <Box display={'flex'} onClick={() => navigate(`/channels/${channelId}`)}>
            <Box>
                <TagIcon fontSize='large' />
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
                <Typography variant='h6'>{channelName}</Typography>
                <Typography variant='body1'>{author}</Typography>
                <Typography variant='body2'>{text}</Typography>
            </Box>
        </Box>
    )
}

ChannelMessageNotification.propTypes = {
    author: PropTypes.string,
    channelName: PropTypes.string,
    text: PropTypes.string,
    channelId: PropTypes.string,
};

export default ChannelMessageNotification
