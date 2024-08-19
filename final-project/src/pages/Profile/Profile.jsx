import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/authContext';
import { Typography } from '@mui/material';

const Profile = () => {

    const { userData } = useContext(AppContext);
    const [data, setData] = useState({
        avatar: '',
        uid: '',
        username: '',
    });

    useEffect(() => {
        if (!userData) return;
        setData({
            ...userData,
            avatar: userData.avatar || '',
            username: userData.username || '',
            uid: userData.uid || '',
        });
    }, [userData]) 
    
    return (
        <div>
            <Typography variant='h1'>Profile</Typography>
            <Typography variant='h5'>Username: {data.username}</Typography>
            <Typography variant='h5'>First Name: {data.firstName}</Typography>
            <Typography variant='h5'>Last Name: {data.lastName}</Typography>
        </div>
    )
}

export default Profile
