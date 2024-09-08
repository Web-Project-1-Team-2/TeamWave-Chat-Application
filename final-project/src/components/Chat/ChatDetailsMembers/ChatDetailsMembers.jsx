/* eslint-disable no-unused-vars */
import { Box, Card, Collapse, Divider, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/authContext';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { chatDetailMembersCollapseBox, chatDetailMembersStyling } from './ChatDetaileMembersStyling';
import ChatMember from './ChatMember/ChatMember';

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
            <Card sx={chatDetailMembersStyling}>
                <Grid container
                    direction={'row'}
                    justifyContent={'flex-start'}
                    alignItems='center'
                    sx={{ width: '100%', height: '100%' }
                    }>
                    <Grid item xs={10} sx={{ width: '100%' }}>
                        <Typography variant='h6' sx={{ ml: 1 }} >Members</Typography>
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
                    <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                        <Box sx={chatDetailMembersCollapseBox}>
                            <Grid container direction={'column'} alignItems='flex-start' sx={{ width: '100%', gap: 0.5 }}>
                                {membersState.map((member) =>
                                    <Grid item container key={member} sx={{ width: '100%' }}>
                                        <ChatMember key={member} username={member} />
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Collapse>
                </Grid>
            </Card >
        </>
    )
}

ChatDetailsMembers.propTypes = {
    id: PropTypes.string,
};

export default ChatDetailsMembers




