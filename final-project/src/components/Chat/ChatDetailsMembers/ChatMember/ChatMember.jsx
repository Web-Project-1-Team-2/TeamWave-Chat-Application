import { Avatar, Box, CardActionArea, Typography } from '@mui/material';
import { ref } from 'firebase/database';
import PropTypes from 'prop-types';
import { useObjectVal } from 'react-firebase-hooks/database';
import { db } from '../../../../config/firebase-config';
import { chatMemberAvatarOnline, chatMemberAvatarStyling, chatMemberStyling } from './chatMembersStyling';
import { useContext } from 'react';
import { AppContext } from '../../../../context/authContext';
import { useNavigate } from 'react-router-dom';

const ChatMember = ({ username }) => {

    const { userData } = useContext(AppContext);

    const navigate = useNavigate();

    const [user] = useObjectVal(ref(db, `users/${username}`));

    return (
        <CardActionArea
            onClick={() => navigate(`/user/${username}`)}
            sx={chatMemberStyling}>
            <Box position={'relative'}>
                <Avatar
                    alt="Member Avatar"
                    src={user?.avatar}
                    sx={chatMemberAvatarStyling} />
                {user?.status === 'online' &&
                    <Box
                        position={'absolute'}
                        bgcolor={'green'}
                        sx={chatMemberAvatarOnline} />
                }
            </Box>
            <Typography variant='h6'>
                {userData?.username === username ? 'You' : username}
            </Typography>
        </CardActionArea>
    )
}

ChatMember.propTypes = {
    username: PropTypes.string.isRequired
};

export default ChatMember
