import { Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const UserSearchCard = ({ username, firstName, lastName, email, id }) => {

    const navigate = useNavigate();

    console.log(id);
    

    return (
        <Card sx={{ maxHeight: '200px', width: '100%', p: 0 }} >
            <Grid container>
                <Grid item xs={10}>
                    <CardContent>
                        <Typography variant='h5'>{username}</Typography>
                        <Typography variant='body1'>{firstName} {lastName}</Typography>
                        <Typography variant='body2'>{email}</Typography>
                    </CardContent>
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
};

export default UserSearchCard;