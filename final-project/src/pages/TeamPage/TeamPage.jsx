import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Typography, Avatar, Box, Grid, IconButton, Divider, Tooltip } from '@mui/material';
import { useListVals } from 'react-firebase-hooks/database';
import TeamUserCard from '../../components/Teams/TeamUserCard/TeamUserCard';
import { AppContext } from '../../context/authContext';
import AddTeamMemberModal from '../../components/Teams/AddTeamMemberModal/AddTeamMemberModal';
import PeopleIcon from '@mui/icons-material/People';
import AddCommentIcon from '@mui/icons-material/AddComment';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { iconStyling, teamPageAvatarStyling } from './TeamPageStyle';
import EditTeamModal from '../../components/Teams/EditTeamModal/EditTeamModal';
import AddChatModal from '../../components/Channel/AddChannelModal/AddChannelModal.jsx';
import { changeTeamAvatar } from './TeamPageStyle.js';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditTeamAvatarModal from '../../components/Teams/EditTeamAvatarModal/EditTeamAvatarModal.jsx';
import { notifyError, notifySuccess } from '../../services/notification.service.js';
import { deleteTeamMember } from '../../services/teams.service.js';
import ChannelCard from '../../components/Channel/ChannelCard/ChannelCard.jsx';

const TeamPage = () => {

    const { userData } = useContext(AppContext);
    const { teamId } = useParams();

    const navigate = useNavigate();

    const [teamData, setTeamData] = useState(null);

    const [teamMembersData, setTeamMembers] = useState([]);
    const [teamMembers] = useListVals(ref(db, `users`));

    const [channels] = useListVals(ref(db, `channels`));
    const [teamChannels, setTeamChannels] = useState([]);


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

    useEffect(() => {
        if (!channels) return;
        if (!userData) return;

        const includedChannels = channels.filter(channel => channel.teamId === teamId && userData?.username in channel.members);
        setTeamChannels(includedChannels);
    }, [channels, teamId, userData]);


    const leaveTeam = async () => {
        if (!userData || !teamData) return;

        try {
            if (userData?.username === teamData.owner) {
                notifyError('You must transfer ownership before leaving the team');
                toggleEditModal();
                return;
            }

            if (teamMembersData.length <= 2) {
                notifyError('You must have at least 2 members in the team');
                toggleAddModal();
                return;
            }

            await deleteTeamMember(userData.username, teamId);
            notifySuccess('Successfully left team');
            navigate('/')
        } catch (error) {
            console.log(error);
            notifyError('Failed to leave team');
        }
    }

    if (!teamData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} alignItems={'center'} gap={5}>
                <Box width={'100%'}>

                    <Divider variant='middle' textAlign='left'>
                        <Typography variant="h2" gutterBottom>{teamData.name}</Typography>
                    </Divider>
                    <Grid container spacing={2} direction={'row'} sx={{ marginTop: '20px' }}>
                        <Grid item xs={8}>
                            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                <Grid item xs={5}>
                                    <Grid container spacing={2} direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: 2 }}>
                                        <Grid container item xs={12} justifyContent={'center'} alignItems={'center'} position={'relative'}>
                                            <Avatar onMouseEnter={toggleIsHovering} alt={teamData.name} src={teamData.avatar} sx={teamPageAvatarStyling} />
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
                                <Grid container item xs={7} alignItems={'center'}>
                                    <Grid item xs={12}>
                                        <Tooltip title="Add Channel" arrow>
                                            <IconButton sx={iconStyling} onClick={toggleAddChannelModal}>
                                                <AddCommentIcon fontSize='inherit' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    {userData?.username === teamData.owner &&
                                        <Grid item xs={12}>
                                            <Tooltip title="Add Team Member" arrow>
                                                <IconButton onClick={toggleAddModal} sx={iconStyling}>
                                                    <GroupAddIcon fontSize='inherit' />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    }
                                    {userData?.username === teamData.owner &&
                                        <Grid item xs={12}>
                                            <Tooltip title="Edit Team" arrow>
                                                <IconButton onClick={toggleEditModal} sx={iconStyling}>
                                                    <EditIcon fontSize='inherit' />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <Tooltip title="Leave Team" arrow>
                                            <IconButton onClick={leaveTeam} sx={iconStyling}>
                                                <RemoveCircleOutlinedIcon fontSize='inherit' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container direction={'column'} spacing={2} sx={{ width: '100%' }}>
                                <Grid item xs={12}>
                                    <Grid container justifyContent='flex-start' alignItems='center' sx={{gap: 1}}>
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
                </Box >
                <Box sx={{
                    width: '60%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h4" gutterBottom>Channels</Typography>
                    <Divider variant='middle' flexItem />
                    <Grid container
                        direction={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        sx={{ marginTop: '20px', gap: 1, width: '100%' }}>
                        {teamChannels.length > 0 ?
                            teamChannels
                            .filter(channel => 'id' in channel)
                            .map(channel =>
                                <Grid container item xs={9}
                                    key={channel.id}
                                    justifyContent={'center'}
                                    sx={{ width: '80%', height: '100px' }}>
                                    <ChannelCard key={channel.id} channelName={channel.name} channelId={channel.id} />
                                </Grid>) :
                            <Typography variant="h6" gutterBottom>No channels available</Typography>
                        }
                    </Grid>
                </Box>
            </Box>
            {addModal &&
                <AddTeamMemberModal open={addModal} toggleModal={toggleAddModal} teamId={teamId} />
            }
            {
                editModal &&
                <EditTeamModal open={editModal} toggleModal={toggleEditModal} teamId={teamId} />
            }
            {
                addChannelModal &&
                <AddChatModal open={addChannelModal} toggleModal={toggleAddChannelModal} teamId={teamId} />
            }
            {
                changeTeamAvatarModal &&
                <EditTeamAvatarModal open={changeTeamAvatarModal} toggle={toggleChangeTeamAvatarModal} teamId={teamId} teamName={teamData.name} />
            }
        </>
    );
};

export default TeamPage;
