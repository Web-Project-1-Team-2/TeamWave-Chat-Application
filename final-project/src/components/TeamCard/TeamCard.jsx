import { Avatar, Card, CardActionArea, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ margin: '0 0 16px 0', width: '90%', minHeight: 60, p: 1 }}>

            <Grid container
                direction={'row'}
                justifyContent={'center'}
                alignItems='center'
                sx={{ width: '100%', height: '100%' }
                }>

                <Grid item xs={10}>
                    <CardActionArea onClick={() => navigate(`/team/${id}`)}>
                        <Grid container
                            direction={'row'}
                            justifyContent={'center'}
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

        </Card >
    )
}

TeamCard.propTypes = {
    avatar: PropTypes.string,
    teamName: PropTypes.string,
    id: PropTypes.string,
};

export default TeamCard
