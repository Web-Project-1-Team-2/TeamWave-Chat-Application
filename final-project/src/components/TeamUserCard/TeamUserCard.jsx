import PropTypes from 'prop-types';
import { Avatar, Card, CardActionArea, Grid, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { deleteTeamMember } from '../../services/teams.service';
import { useContext } from 'react';
import { AppContext } from '../../context/authContext';

const TeamUserCard = ({ avatar, username, id, owner, teamId }) => {

    const { userData } = useContext(AppContext);

    const navigate = useNavigate();

    const isOwner = userData.username === owner ? true : false;

    const isUser = userData.username === username ? true : false;

    const handleDeleteMember = async () => {
        try {
            await deleteTeamMember(username, teamId);
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    return (
        <Card sx={{ margin: '0 0 16px 0', width: '100%', maxHeight: 100, p: 2 }}>
            <Grid container
                direction={'row'}
                justifyContent={'center'}
                alignItems='center'
                sx={{ width: '100%', height: '100%' }
                }>

                <Grid item xs={10} sx={{ width: '100%' }}>
                    <CardActionArea >
                        <Grid container
                            direction={'row'}
                            justifyContent={'space-around'}
                            alignItems='center'
                            sx={{ width: '100%', height: '100%' }
                            }>
                            <Grid item xs={4}  >
                                <Avatar
                                    src={avatar}
                                    sx={{ width: '70px', height: '70px', mr: 2 }}
                                >
                                    {!avatar && (username ? username[0].toUpperCase() : <Typography variant='h6'>T</Typography>)}
                                </Avatar>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant='h5'>{username}</Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea >
                </Grid>
                
                <Grid item xs={2}>
                    {isOwner &&
                        <IconButton onClick={handleDeleteMember} size="large">
                            <CloseRoundedIcon fontSize='inherit' />
                        </IconButton>}
                </Grid>

            </Grid>
        </Card >
    )
}

TeamUserCard.propTypes = {
    avatar: PropTypes.string,
    username: PropTypes.string,
    id: PropTypes.string,
    owner: PropTypes.string,
    teamId: PropTypes.string,
};

export default TeamUserCard
