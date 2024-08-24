import PropTypes from 'prop-types';
import { Card, CardActionArea, Grid, Typography } from '@mui/material';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { useNavigate } from 'react-router-dom';

const ChannelCard = ({ channelName, channelId }) => {

    const navigate = useNavigate();

    return (
        <Card sx={{mt: 1, p: 0.5}}>
            <CardActionArea onClick={() => navigate(`/channel/${channelId}`)}>
                <Grid container alignItems={'center'}>
                    <Grid container item xs={3} alignItems={'center'} justifyContent={'center'} >
                        <LockOpenOutlinedIcon />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant='body2' >
                            {channelName}
                        </Typography>

                    </Grid>
                </Grid>
            </CardActionArea>
        </Card>
    )
}

ChannelCard.propTypes = {
    channelName: PropTypes.string.isRequired,
    channelId: PropTypes.string.isRequired
};

export default ChannelCard
