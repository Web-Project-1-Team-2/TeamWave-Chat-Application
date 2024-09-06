import PropTypes from 'prop-types';
import { Avatar, Box, CardActionArea, Divider, Grid, Typography } from "@mui/material";
import { useState } from 'react';
import TeamModalCard from '../TeamModalCard/TeamModalCard';

function TeamOwnerCard({avatar,teamName, teamMembers, teamChannels, teamId}) {
    
    const [open, setOpen] = useState(false);
    const handleOpenModal = () => setOpen(true);
    const handleCloseModal =() => setOpen(false);

    return (
    <CardActionArea sx={{ margin: '0 0 16px 0', width: '100%', maxHeight: 100}} onClick={!open?handleOpenModal:handleCloseModal}>
            <Grid container
                direction={'row'}
                justifyContent={'center'}
                alignItems='center'
                sx={{ width: '100%', height: '100%' }
                }>

                <Grid item xs={10} sx={{ width: '100%', padding: '16px 0'}}>
                    <Box >
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
                    </Box>
                </Grid>
            </Grid>
            <TeamModalCard 
            open={open}
            handleClose={handleCloseModal}
            avatar={avatar}
            teamNames={teamName}
            teamMembers={teamMembers}
            teamChannels={teamChannels}
            teamId={teamId}
            />
            <Divider ></Divider>
        </CardActionArea>
    )
    
}

TeamOwnerCard.propTypes = {
    avatar: PropTypes.string,
    teamName: PropTypes.string,
    teamMembers: PropTypes.object,
    teamChannels:PropTypes.object,
    teamId:PropTypes.string, 
};

export default TeamOwnerCard
