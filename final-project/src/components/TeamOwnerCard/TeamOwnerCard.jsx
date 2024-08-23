import PropTypes from 'prop-types';

import { Avatar, Card, CardActionArea, Grid, Typography } from "@mui/material";

function TeamOwnerCard({avatar,teamName}) {
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
                                    sx={{ width: '50px', height: '50px', mr: 2 }}
                                >
                                    {!avatar && (teamName ? teamName[0].toUpperCase() : <Typography variant='h6'>T</Typography>)}
                                </Avatar>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant='h6'>{teamName}</Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea >
                </Grid>
            </Grid>
        </Card >
    )
}

TeamOwnerCard.propTypes = {
    avatar: PropTypes.string,
    teamName: PropTypes.string,
    id: PropTypes.string,
    owner: PropTypes.string,
    teamId: PropTypes.string,
};

export default TeamOwnerCard
