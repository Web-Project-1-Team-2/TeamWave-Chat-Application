import PropTypes from 'prop-types';
import { Avatar, CardActionArea, Grid, Typography, Box, Divider } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import { deleteTeamMember } from '../../../services/teams.service';
import { useContext } from 'react';
import { AppContext } from '../../../context/authContext';
import { notifyError, notifySuccess } from '../../../services/notification.service';
import { useNavigate } from 'react-router-dom';
import { teamUserCardStyling } from './TeamUserCardStyling';

const TeamUserCard = ({ avatar, username, owner, teamId }) => {

    const navigate = useNavigate();

    const { userData } = useContext(AppContext);

    const isOwner = userData?.username === owner ? true : false;

    const removeMember = async () => {
        try {
            await deleteTeamMember(username, teamId);
            notifySuccess('Member removed successfully');
        } catch (error) {
            console.log(error);
            notifyError('Failed to remove member');
        }
    };

    const handleGoToProfile = () => {
        if (username === userData?.username) {
            navigate('/profile');
            return;
        }
        navigate(`/user/${username}`);
    }

    return (
        <>
            <CardActionArea sx={teamUserCardStyling}>
                <Grid container
                    direction={'row'}
                    justifyContent={'center'}
                    alignItems='center'
                    sx={{ width: '100%', height: '100%' }}>
                    <Grid item xs={10} sx={{ width: '100%' }}>
                        <Box onClick={handleGoToProfile}>
                            <Grid container
                                direction={'row'}
                                justifyContent={'space-around'}
                                alignItems='center'
                                sx={{ width: '100%', height: '100%' }}>
                                <Grid item xs={4}  >
                                    <Avatar
                                        src={avatar}
                                        sx={{ width: '50px', height: '50px', mr: 2 }}>
                                        {!avatar && (username ? username[0].toUpperCase() : <Typography variant='h6'>T</Typography>)}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant='h6'>{username}</Typography>
                                </Grid>
                            </Grid>
                        </Box >
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'center' }}>
                        {isOwner &&
                            <IconButton onClick={removeMember} size="large">
                                <CloseRoundedIcon fontSize='inherit' />
                            </IconButton>}
                    </Grid>
                </Grid>
            </CardActionArea >
            <Divider/>
        </>
    )
}

TeamUserCard.propTypes = {
    avatar: PropTypes.string,
    username: PropTypes.string,
    owner: PropTypes.string,
    teamId: PropTypes.string,
};

export default TeamUserCard
