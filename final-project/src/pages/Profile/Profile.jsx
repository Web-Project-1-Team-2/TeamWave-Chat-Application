import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Avatar, Box, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import UploadAvatar from "../../components/User/UploadAvatar/UploadAvatar";
import UpdateLastName from "../../components/User/UpdateLastName/UpdateLastName";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import UpdateFirstName from "../../components/User/UpdateFirstName/UpdateFirstName";
import EditIcon from "@mui/icons-material/Edit";
import TeamOwnerCard from "../../components/Teams/TeamOwnerCard/TeamOwnerCard";
import { addPhotoIconStyle, avatarStyle, changeTeamAvatar, myTeamsBoxStyle} from "./ProfilePageStyling";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PeopleIcon from '@mui/icons-material/People';


const Profile = () => {

  const { userData } = useContext(AppContext); 

  const [teams] = useListVals(ref(db, `teams`));

  const [myTeams, setMyTeams] = useState([]);
 
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [openFirstName, setOpenFirstName] = useState(false);
  const handleOpenFirstName = () => setOpenFirstName(true);
  const handleCloseFirstName = () => setOpenFirstName(false);
  
  const [openLastName, setOpenLastName] = useState(false);
  const handleOpenLastName = () => setOpenLastName(true);
  const handleCloseLastName = () => setOpenLastName(false);
  
  const [isHovering, setIsHovering] = useState(false);
  const toggleIsHovering = () => setIsHovering(!isHovering);
  
  const [profile, loadingProfile] = useObjectVal(
    ref(db, `users/${userData?.username}`)
  );
  
  const [profileState, setProfileState] = useState({
    avatar: "",
    uid: "",
    username: "",
    firstName: "",
    lastName: "",
    status: "",
  });
  
  useEffect(() => {
    if (!teams || !userData) return;
    const ownerTeams = teams.filter((team) => team.owner === userData.username);
    setMyTeams(ownerTeams);
  }, [teams, userData]);
  
  
  useEffect(() => {
    if (!profile) return;
    setProfileState({
      ...profile,
      avatar: profile.avatar || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
    });
  }, [profile]);


  if (loadingProfile) return <div>Loading...</div>;

  return (
    <Box width="100%" textAlign="center">
      <Divider variant="middle">
      <Typography variant="h3" mb={3}>
        Profile
      </Typography>
      </Divider>

      <Stack direction="row" gap={3} alignItems="center">
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
        >
          <Box
            display="flex"
            alignItems="center"
            position={'relative'}
            mb={2}
            gap={3}
            sx={{ mb: "150px" }}
          >

            <Avatar
              onMouseEnter={toggleIsHovering}
              src={profileState.avatar}
              sx={avatarStyle}
            >
              {!profileState.avatar &&
                (profileState.firstName
                  ? profileState.firstName[0].toUpperCase() +
                  profileState.lastName[0].toUpperCase()
                  : "A")}
            </Avatar>
            {isHovering &&
              <div
                style={changeTeamAvatar}
                onMouseLeave={toggleIsHovering}
                onClick={handleOpen}>
                <AddPhotoAlternateIcon sx={addPhotoIconStyle} />
              </div>
            }
            {/* {profileState.status === "online" &&
              <Box
                position={'absolute'}
                bgcolor={'green'}
                borderRadius={'50%'}
                sx={profileStatusStyle} />
            } */}

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap={3}
            >
              <Typography variant="h6">Username: {profileState.username}</Typography>   
              <Stack>
                <Typography variant="h6">
                  First Name: {profileState.firstName}
                  <Tooltip title='Change name' arrow>
                  <IconButton onClick={handleOpenFirstName} >
                    <EditIcon cursor="pointer" />
                  </IconButton>
                  </Tooltip>
                </Typography>
              </Stack>
              <Stack alignItems="center" >
                <Typography variant="h6">
                  Last Name: {profileState.lastName}
                  <Tooltip title='Change name' arrow>
                  <IconButton onClick={handleOpenLastName}>
                    <EditIcon cursor="pointer" />
                  </IconButton>
                  </Tooltip>
                </Typography>
              </Stack>
              
            </Box>
          </Box>
          <UploadAvatar
            open={open}
            handleClose={handleClose}
            avatar={userData?.avatar}
            username={userData?.username}
            uid={userData?.uid}
          />
          <UpdateFirstName
            open={openFirstName}
            handleClose={handleCloseFirstName}
            username={userData?.username}
            firstName={userData.firstName}
          />
          <UpdateLastName
            open={openLastName}
            handleClose={handleCloseLastName}
            username={userData?.username}
            lastName={userData?.lastName}
          />
        </Box>
        <Stack direction="column" spacing={1} width="100%" alignItems="center" marginTop="80px">
          <Box
            width="100%"
            display="flex"
            textAlign="center"
            justifyContent="center"
            alignItems="center"
          >
            <PeopleIcon fontSize="medium"/>
            <Typography variant="h5">My teams:</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            sx={myTeamsBoxStyle}
          >
            {myTeams.map((team) => (
              <TeamOwnerCard
                key={team.id}
                avatar={team.avatar}
                teamName={team.name}
                teamMembers={team.members}
                teamChannels={team.channels}
                teamId={team.id}
              />
            ))}
          </Box>
        </Stack>
      </Stack>
      <Divider></Divider> 
      <Typography variant="h6">Created on: {profileState.createdOn}</Typography>
    </Box>
  );
};

export default Profile;
