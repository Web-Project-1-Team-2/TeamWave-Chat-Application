import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Checkbox, Grid } from '@mui/material';

const UserCardEditOwner = ({ username, firstName, lastName, email, teamMembers, setTeamMembers }) => {

    const handleSetNewOwner = () => {
        const obj = Object.keys(teamMembers);

        if (obj.length > 0) {
            setTeamMembers({});
        }

        if (teamMembers[username]) {
            setTeamMembers((prev) => {
                const newMembers = { ...prev };
                delete newMembers[username];
                return newMembers;
            });
        } else {
            setTeamMembers({ [username]: true });
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
                        onChange={() => handleSetNewOwner()} />
                </Grid>
            </Grid>
        </Card>
    )
}

UserCardEditOwner.propTypes = {
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    teamMembers: PropTypes.object,
    setTeamMembers: PropTypes.func,
};

export default UserCardEditOwner
