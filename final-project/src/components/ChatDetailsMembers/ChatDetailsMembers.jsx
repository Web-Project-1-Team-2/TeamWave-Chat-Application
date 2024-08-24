import { Box, Card, Collapse, Divider, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/authContext';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../config/firebase-config';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const ChatDetailsMembers = ({ id }) => {

    const { userData } = useContext(AppContext);

    // const navigate = useNavigate();

    const [channelMembers] = useObjectVal(ref(db, `channels/${id}/members`));

    const [membersState, setMembersState] = useState([]);

    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (!channelMembers) return;
        const members = Object.keys(channelMembers);
        setMembersState(members);
    }, [channelMembers]);


    return (
        <>
            <Card sx={{
                margin: '0 0 16px 0',
                width: '90%',
                minHeight: 60,
                p: 1,
                bgcolor: 'transparent',
                boxShadow: 'none'
            }}>
                <Grid container
                    direction={'row'}
                    justifyContent={'flex-start'}
                    alignItems='center'
                    sx={{ width: '100%', height: '100%' }
                    }>
                    <Grid item xs={10} sx={{ width: '100%' }}>
                        <Typography variant='h6'>Members</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Grid>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box>
                            <Grid container direction={'column'} alignItems='flex-start' sx={{ width: '100%' }}>
                                {membersState.map(member =>
                                    <Grid item container key={member}>
                                        <Typography variant='body1'>
                                            {member} {userData?.username === member ? '(You)' : null}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Collapse>
                </Grid>
                <Divider flexItem />
            </Card >
        </>
    )
}

ChatDetailsMembers.propTypes = {
    id: PropTypes.string,
};

export default ChatDetailsMembers




