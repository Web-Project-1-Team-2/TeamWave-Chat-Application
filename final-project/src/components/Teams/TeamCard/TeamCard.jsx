/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Avatar, Box, Card, CardActionArea, Collapse, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/authContext';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import ChannelCard from '../../Channel/ChannelCard/ChannelCard';

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

const TeamCard = ({ avatar, teamName, id }) => {

    const { userData } = useContext(AppContext);
    const [channels] = useListVals(ref(db, 'channels'));

    const [teamChannels, setTeamChannels] = useState([]);

    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [unreadMessages, setUnreadMessages] = useState(false);

    useEffect(() => {
        if (!userData) return;
        if (!channels) return;
        const userChannels = channels.filter(channel => channel.teamId === id && channel.members[userData?.username] && 'id' in channel);

        const hasUnreadMessages = userChannels.some(channel => {

            const lastSeenUser = channel.members[userData.username];
            if (channel.messages === undefined) return false;
            const channelMessages = Object.values(channel.messages);

            return channelMessages.some(message => message.timestamp > lastSeenUser);
        })

        setUnreadMessages(hasUnreadMessages);
    }, [userData, channels]);

    useEffect(() => {
        if (!userData) return;
        if (!channels) return;
        const userChannels = channels.filter(channel =>
            channel.teamId === id && channel.members[userData.username] && 'id' in channel);
        setTeamChannels(userChannels);
    }, [userData, channels]);

    return (
        <Card sx={{ margin: '0 0 16px 0', width: '90%', minHeight: 60, p: 1 }}>

            <Grid container
                direction={'row'}
                justifyContent={'center'}
                alignItems='center'
                sx={{ width: '100%', height: '100%', gap: 0}
                }>
                {unreadMessages &&
                    <Grid item xs={1}>
                        <Box sx={{ borderRadius: '50%', bgcolor: '#d32f2f', width: '15px', height: '15px' }} />
                    </Grid>
                }
                <Grid item xs={unreadMessages ? 9 : 10} sx={{ width: '100%' }}>
                    <CardActionArea onClick={() => navigate(`/team/${id}`)}>
                        <Grid container
                            direction={'row'}
                            justifyContent={'space-around'}
                            alignItems='center'
                            sx={{ width: '100%', height: '100%' }
                            }>
                            <Grid item xs={3}  >
                                <Avatar
                                    src={avatar}
                                    sx={{ width: '50px', height: '50px', mr: 2 }}
                                >
                                    {!avatar && (teamName ? teamName[0].toUpperCase() : 'T')}
                                </Avatar>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{teamName}</Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea >
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
            </Grid>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {teamChannels.map(channel =>
                    <ChannelCard
                        key={channel.id}
                        channelName={channel.name}
                        channelId={channel.id} />)
                }
            </Collapse>
        </Card >
    )
}

TeamCard.propTypes = {
    avatar: PropTypes.string,
    teamName: PropTypes.string,
    id: PropTypes.string,
};

export default TeamCard
