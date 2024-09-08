import PropTypes from 'prop-types';
import { Avatar, Box, CardActionArea, Divider, Grid, Tooltip, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function TeamOwnerCard({ avatar, teamName, teamId }) {

    const navigate = useNavigate();


    return (
        <Tooltip title="Show Team" arrow>
            <CardActionArea
                sx={{ margin: '0 0 16px 0', width: '100%', maxHeight: 100, borderRadius: 2 }}
                onClick={() => navigate(`/teams/${teamId}`)}
            >
                <Grid container
                    direction={'row'}
                    justifyContent={'center'}
                    alignItems='center'
                    sx={{ width: '100%', height: '100%' }
                    }>

                    <Grid
                        item xs={10}
                        sx={{ width: '100%', padding: '16px 0' }}
                    >
                        <Box >
                            <Grid container
                                direction={'row'}
                                justifyContent={'space-around'}
                                alignItems='center'
                                sx={{ width: '100%', height: '100%' }
                                }>
                                <Grid item xs={4}>
                                    <Avatar
                                        src={avatar}
                                        sx={{ width: '50px', height: '50px', mr: 2 }}
                                    >
                                        {!avatar && (teamName ? teamName[0].toUpperCase() : <Typography variant='h6'>T</Typography>)}
                                    </Avatar>

                                </Grid>
                                <Grid container item xs={8} justifyContent={'flex-start'}>
                                    <Typography variant='h6'>{teamName}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Divider ></Divider>
            </CardActionArea>
        </Tooltip>
    )

}

TeamOwnerCard.propTypes = {
    avatar: PropTypes.string,
    teamName: PropTypes.string,
    teamMembers: PropTypes.object,
    teamChannels: PropTypes.object,
    teamId: PropTypes.string,
};

export default TeamOwnerCard
