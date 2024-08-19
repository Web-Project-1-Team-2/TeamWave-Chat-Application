import { Card, CardContent, Typography, Checkbox, Grid } from '@mui/material';
import PropTypes from 'prop-types';

const UserCard = ({ username, firstName, lastName, email, teamMembers, setTeamMembers }) => {

    const toggleCheckbox = () => {
        if (teamMembers[username]) {
            setTeamMembers((prev) => {
                const newMembers = { ...prev };
                delete newMembers[username];
                return newMembers;
            });
        } else {
            setTeamMembers((prev) => {
                return {
                    ...prev,
                    [username]: true
                }
            });
        }
    }

    return (
        <Card sx={{ maxHeight: '200px', width: '100%', p: 0 }} >
            <Grid container>
                <Grid item xs={10}>
                    <CardContent>
                        <Typography variant='h5'>{username}</Typography>
                        <Typography variant='body1'>{firstName} {lastName}</Typography>
                        <Typography variant='body2'>{email}</Typography>
                    </CardContent>
                </Grid>
                <Grid container item xs={2} alignItems='center' justifyContent='center'>
                    <Checkbox
                        size='large'
                        checked={teamMembers[username] ? true : false}
                        onChange={() => toggleCheckbox()} />
                </Grid>
            </Grid>
        </Card>
    )
}

UserCard.propTypes = {
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    teamMembers: PropTypes.object,
    setTeamMembers: PropTypes.func,
};

export default UserCard
