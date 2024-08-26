import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { AppContext } from '../../../context/authContext';
import { ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { useListVals } from 'react-firebase-hooks/database';
import { Button } from '@mui/material';
import UserSearchCard from '../../User/UserSearchCard/UserSearchCard';
import { searchUserBoxStyle, searchUserButtonSection, searchUserModalStyle, searchUserScrollBox } from './SearchForUserModalStyle';


const SearchForUserModal = ({ open, toggleModal }) => {

    const { userData } = useContext(AppContext);

    const [searchUser, setSearchUser] = useState('');

    const [users, loadingUsers] = useListVals(ref(db, 'users'));
    const [allOtherUsers, setAllOtherUsers] = useState([]);

    useEffect(() => {
        if (!users) return;
        const allOtherUsers = users.filter(user => user.username !== userData?.username);
        setAllOtherUsers(allOtherUsers);
    }, [users]);

    if (loadingUsers) return <div>Loading...</div>;

    return (
        <div>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={searchUserModalStyle}
            >
                <Box sx={searchUserBoxStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Search for User
                    </Typography>

                    <TextField
                        id="search-user"
                        label="Search for User"
                        variant="outlined"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        sx={{ width: '80%' }}
                    />

                    {searchUser !== '' &&
                        <>
                            <Box sx={searchUserScrollBox}>
                                <List sx={{ width: '80%' }}>
                                    {allOtherUsers
                                        .filter((user) => user.username !== userData?.username && user.username.toLowerCase().includes(searchUser.toLowerCase()))
                                        .map((user) => (
                                            <ListItem key={user.uid} sx={{ p: 0, mb: 2 }}>
                                                <UserSearchCard 
                                                username={user.username} 
                                                firstName={user.firstName} 
                                                lastName={user.lastName} 
                                                email={user.email} 
                                                id={user.uid} />
                                            </ListItem>
                                        ))}
                                </List>
                            </Box>
                            </>
                        }
                            <Box sx={searchUserButtonSection}>
                                <Button variant='contained' onClick={toggleModal}>Close</Button>
                            </Box>
                </Box>
            </Modal>
        </div>
    );
}

SearchForUserModal.propTypes = {
    open: PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default SearchForUserModal;