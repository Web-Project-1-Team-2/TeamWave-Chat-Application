import { Avatar, Grid, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ChatBox = ({ text, avatar, username, timestamp, isCurrUser }) => {
    return (
        <Paper sx={{
            maxWidth: '75%',
            minWidth: '25%',
            padding: '8px',
            margin: '8px',
            borderRadius: '15px',
        }}>
            <Grid container direction={isCurrUser ? 'row-reverse' : 'row'} spacing={0.5}>
                <Grid container item xs={2} justifyContent={'end'}>
                    <Avatar
                        alt="Sender Avatar"
                        src={avatar}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                        }}
                    />

                </Grid>
                <Grid container direction={'column'} item xs={10}>
                    <Grid item>
                        <Grid container justifyContent='flex-start' alignItems='center' sx={{ gap: '8px' }} >
                            <Typography variant='h6'>{username}</Typography>
                            <Typography component={'p'} variant='body2'>{new Date(timestamp).toLocaleTimeString()}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>{text}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

ChatBox.propTypes = {
    text: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string,
    timestamp: PropTypes.string,
    isCurrUser: PropTypes.bool
};

export default ChatBox
