import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';

const ChatBox = ({ text, avatar, username, timestamp, isCurrUser }) => {

    const flexDir = isCurrUser ? 'row-reverse' : 'row';


    const timeAgoUsingMoment = (date) => {
        return moment(date).fromNow();
    }
    
    const timeAgo = timeAgoUsingMoment(timestamp);

    return (
        <Box sx={{
            maxWidth: '75%',
            minWidth: '25%',
            width: 'fit-content',
            padding: '8px',
            margin: '8px',
            borderRadius: '15px',
            display: 'flex',
            gap: '8px',
            flexDirection: flexDir,
        }}>
            <Avatar
                alt="Sender Avatar"
                src={avatar}
                sx={{
                    width: 45,
                    height: 45,
                    borderRadius: '50%',
                }}
            />
            <Grid container spacing={1}>
                <Grid container direction={'column'} item xs={12}>
                    <Paper sx={{
                        padding: '8px',
                        borderRadius: '15px',
                    }}>
                        <Grid item>
                            <Grid container justifyContent='flex-start' alignItems='center' sx={{ gap: '8px' }} >
                                <Typography variant='h6'>{username}</Typography>
                                <Typography component={'p'} variant='body2'>{timeAgo}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant='body1'>{text}</Typography>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box >

    )
}

ChatBox.propTypes = {
    text: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string,
    timestamp: PropTypes.number,
    isCurrUser: PropTypes.bool
};

export default ChatBox

//const options = { hour: '2-digit', minute: '2-digit', hour12: false };
//new Date(timestamp).toLocaleTimeString([], options)