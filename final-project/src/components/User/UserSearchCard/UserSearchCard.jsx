import { Card, Typography, Grid, IconButton, CardActionArea } from '@mui/material';
import PropTypes from 'prop-types';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../../context/authContext';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { createNewDirectMessage } from '../../../services/directMessages.service';
import { notifyError } from '../../../services/notification.service';

const UserSearchCard = ({ username, firstName, lastName, email, id, toggleModal }) => {

    const { userData } = useContext(AppContext)

    const [directMessages] = useListVals(ref(db, `directMessages`));

    const navigate = useNavigate();
    
    const handleGoToProfile = () => {
        navigate(`/user/${username}`);
        toggleModal();
    }

    const handleGoToDirectMessage = async () => {
        const existingDirectMessage = directMessages.find(dm => username in dm.members && userData?.username in dm.members);

        try {
            if(existingDirectMessage) {
                navigate(`/dm/${existingDirectMessage.id}`);
            } else {
                const newDirectMessageChat = await createNewDirectMessage(userData?.username, username);
                navigate(`/dm/${newDirectMessageChat.id}`);
            }
        } catch (error) {
            console.error(error);
            notifyError('Error reaching the user chat');
        }
        toggleModal();
    }

    return (
        <Card sx={{ maxHeight: '200px', width: '100%', p: 0 }} >
            <Grid container>
                <Grid item xs={10}>
                    <CardActionArea onClick={handleGoToProfile} sx={{padding: 2}}>
                        <Typography variant='h5'>{username}</Typography>
                        <Typography variant='body1'>{firstName} {lastName}</Typography>
                        <Typography variant='body2'>{email}</Typography>
                    </CardActionArea>
                </Grid>
                <Grid container item xs={2} alignItems='center' justifyContent='center'>
                    <IconButton onClick={handleGoToDirectMessage} aria-label="chat-with-user" size="large" >
                        <SendIcon fontSize='inherit'/>
                    </IconButton>
                </Grid>
            </Grid>
        </Card>
    )
}

UserSearchCard.propTypes = {
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    toggleModal: PropTypes.func,
};

export default UserSearchCard;