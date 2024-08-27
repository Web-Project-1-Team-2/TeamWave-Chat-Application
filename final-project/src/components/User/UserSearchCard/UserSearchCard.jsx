import { Card, Typography, Grid, IconButton, CardActionArea } from '@mui/material';
import PropTypes from 'prop-types';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const UserSearchCard = ({ username, firstName, lastName, email, id, toggleModal }) => {

    const navigate = useNavigate();

    console.log(id);
    
    const handleGoToProfile = () => {
        navigate(`/user/${username}`);
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
                    <IconButton onClick={() => navigate(`/chat/${id}`)} aria-label="chat-with-user" size="large" >
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