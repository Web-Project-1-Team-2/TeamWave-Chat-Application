import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Box, Typography } from '@mui/material';

const UserBoardNoMessages = () => {
    return (
        <Box sx={{
            width: '100%',
            height: '40vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
        }}>
            <DoneAllIcon sx={{width: 100, height: 100}} />
            <Typography variant='h5'>Good job! No unread messages</Typography>
        </Box>
    )
}

export default UserBoardNoMessages
