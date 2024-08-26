import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Typography, Avatar, Box, Grid, IconButton } from '@mui/material';
import { useListVals } from 'react-firebase-hooks/database';
import TeamUserCard from '../../components/Teams/TeamUserCard/TeamUserCard';
import { AppContext } from '../../context/authContext';
import AddTeamMemberModal from '../../components/Teams/AddTeamMemberModal/AddTeamMemberModal';
import PeopleIcon from '@mui/icons-material/People';
import AddCommentIcon from '@mui/icons-material/AddComment';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { iconStyling } from './TeamPageStyle';
import EditTeamModal from '../../components/Teams/EditTeamModal/EditTeamModal';
import AddChatModal from '../../components/Channel/AddChannelModal/AddChannelModal.jsx';
import { changeTeamAvatar } from './TeamPageStyle.js';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditTeamAvatarModal from '../../components/Teams/EditTeamAvatarModal/EditTeamAvatarModal.jsx';

const TeamPage = () => {

    const { userData } = useContext(AppContext);
    const { teamId } = useParams();

    const [teamData, setTeamData] = useState(null);

    const [teamMembersData, setTeamMembers] = useState([]);

    const [teamMembers] = useListVals(ref(db, `users`));

    const [addModal, setAddModal] = useState(false);
    const toggleAddModal = () => setAddModal(!addModal);

    const [editModal, setEditModal] = useState(false);
    const toggleEditModal = () => setEditModal(!editModal);

    const [addChannelModal, setAddChannelModal] = useState(false);
    const toggleAddChannelModal = () => setAddChannelModal(!addChannelModal);

    const [isHovering, setIsHovering] = useState(false);
    const toggleIsHovering = () => setIsHovering(!isHovering);

    const [changeTeamAvatarModal, setChangeTeamAvatarModal] = useState(false);
    const toggleChangeTeamAvatarModal = () => setChangeTeamAvatarModal(!changeTeamAvatarModal);


    useEffect(() => {
        const teamRef = ref(db, `teams/${teamId}`);
        const unsubscribe = onValue(teamRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTeamData(data);
            }
        });
        return () => unsubscribe();
    }, [teamId]);

    useEffect(() => {
        if (!teamMembers) return;
        const includedMembers = teamMembers.filter((member) => teamData?.members[member.username]);
        setTeamMembers(includedMembers);
    }, [teamData, teamMembers]);

    if (!teamData) {
        return <div>Loading...</div>;
    }

    console.log(teamData);
    

    return (
        <>
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="h2" gutterBottom>{teamData.name}</Typography>
                <Grid container spacing={2} direction={'row'} sx={{ marginTop: '20px' }}>
                    <Grid item xs={8}>
                        <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                            <Grid item xs={5}>
                                <Grid container direction={'column'} spacing={2} alignItems={'center'} justifyContent={'center'} sx={{ borderRight: '2px solid black' }}>
                                    <Grid container item xs={12} justifyContent={'center'} alignItems={'center'} position={'relative'}>
                                        <Avatar onMouseEnter={toggleIsHovering} alt={teamData.name} src={teamData.avatar} sx={{ width: 200, height: 200 }} />
                                        {isHovering &&
                                            <div
                                                style={changeTeamAvatar}
                                                onMouseLeave={toggleIsHovering}
                                                onClick={toggleChangeTeamAvatarModal}>
                                                <AddPhotoAlternateIcon sx={{ fontSize: 50 }} />
                                            </div>}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component="h5" variant="h4">
                                            Owner: {teamData.owner}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={7}>
                                <Grid container direction={'column'} spacing={2}>
                                    <Grid item xs={12}>
                                        <IconButton sx={iconStyling} onClick={toggleAddChannelModal}>
                                            <AddCommentIcon fontSize='inherit' />
                                        </IconButton>
                                    </Grid>
                                    {userData?.username === teamData.owner &&
                                        <Grid item xs={12}>
                                            <IconButton onClick={toggleAddModal} sx={iconStyling}>
                                                <GroupAddIcon fontSize='inherit' />
                                            </IconButton>
                                        </Grid>
                                    }
                                    {userData?.username === teamData.owner &&
                                        <Grid item xs={12}>
                                            <IconButton sx={iconStyling} onClick={toggleEditModal}>
                                                <EditIcon fontSize='inherit' />
                                            </IconButton>
                                        </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <IconButton sx={iconStyling}>
                                            <RemoveCircleOutlinedIcon fontSize='inherit' />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container direction={'column'} spacing={2} sx={{ width: '100%' }}>
                            <Grid item xs={12}>
                                <Grid container justifyContent='flex-start' alignItems='center'>
                                    <PeopleIcon fontSize='medium' />
                                    <Typography variant="h5">Team Members</Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <Box sx={{ height: '400px', overflow: 'auto', }}>
                                    {teamMembersData.map(member => <TeamUserCard
                                        key={member.uid}
                                        avatar={member.avatar}
                                        username={member.username}
                                        id={member.uid}
                                        owner={teamData.owner}
                                        teamId={teamId}
                                    />)}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {addModal &&
                <AddTeamMemberModal open={addModal} toggleModal={toggleAddModal} teamId={teamId} />
            }
            {editModal &&
                <EditTeamModal open={editModal} toggleModal={toggleEditModal} teamId={teamId} />
            }
            {addChannelModal &&
                <AddChatModal open={addChannelModal} toggleModal={toggleAddChannelModal} teamId={teamId} />
            }
            {changeTeamAvatarModal &&
                <EditTeamAvatarModal open={changeTeamAvatarModal} toggle={toggleChangeTeamAvatarModal} teamId={teamId} teamName={teamData.name}/>
            }
        </>
    );
};

export default TeamPage;
