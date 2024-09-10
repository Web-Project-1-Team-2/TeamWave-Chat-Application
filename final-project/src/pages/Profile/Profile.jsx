import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import UploadAvatar from "../../components/User/UploadAvatar/UploadAvatar";
import UpdateLastName from "../../components/User/UpdateLastName/UpdateLastName";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import UpdateFirstName from "../../components/User/UpdateFirstName/UpdateFirstName";
import EditIcon from "@mui/icons-material/Edit";
import TeamOwnerCard from "../../components/Teams/TeamOwnerCard/TeamOwnerCard";
import {
  addPhotoIconStyle,
  avatarStyle,
  changeTeamAvatar,
  myTeamsBoxStyle,
} from "./ProfilePageStyling";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PeopleIcon from "@mui/icons-material/People";



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

  const [editFirstName, setEditFirstName] = useState(false);
  const toggleEditFirstName = () => setEditFirstName(!editFirstName);

  const [editLastName, setEditLastName] = useState(false);
  const toggleEditLastName = () => setEditLastName(!editLastName);


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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      gap: 10,
    }}>

      <Divider variant="middle" textAlign="left" sx={{ width: '100%' }}>
        <Typography variant="h3">
          Profile
        </Typography>
      </Divider>

      <Stack direction="row" gap={10} alignItems="center" width={'100%'}>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
        >
          <Box
            display="flex"
            flexDirection={'column'}
            alignItems="center"
            position={"relative"}
            mb={2}
            gap={3}
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
            {isHovering && (
              <div
                style={changeTeamAvatar}
                onMouseLeave={toggleIsHovering}
                onClick={handleOpen}
              >
                <AddPhotoAlternateIcon sx={addPhotoIconStyle} />
              </div>
            )}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap={2}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
              }}>
                <Box sx={{height: '40px'}}>
                  <Typography variant="h4">
                    Username: {profileState.username}
                  </Typography>
                </Box>
                <Box
                  onMouseEnter={toggleEditFirstName}
                  onMouseLeave={toggleEditFirstName}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px',
                    gap: 1,
                  }}>
                  <Typography variant="h5">
                    First Name: {profileState.firstName}
                  </Typography>
                  {editFirstName &&
                    <Tooltip title="Change Name" arrow>
                      <IconButton onClick={handleOpenFirstName} sx={{ height: '40px', width: '40px' }}>
                        <EditIcon cursor="pointer" />
                      </IconButton>
                    </Tooltip>
                  }
                </Box>
                <Box
                  onMouseEnter={toggleEditLastName}
                  onMouseLeave={toggleEditLastName}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px',
                    gap: 1,
                  }}>
                  <Typography variant="h5">
                    Last Name: {profileState.lastName}
                  </Typography>
                  {editLastName &&
                    <Tooltip title="Change Name" arrow>
                      <IconButton onClick={handleOpenLastName} sx={{ height: '40px', width: '40px' }} >
                        <EditIcon cursor="pointer" />
                      </IconButton>
                    </Tooltip>
                  }
                </Box>
              </Box>
            </Box>
          </Box>
          <UploadAvatar
            open={open}
            handleClose={handleClose}
            avatar={userData?.avatar || null}
            username={userData?.username}
            uid={userData?.uid}
          />
          <UpdateFirstName
            open={openFirstName}
            handleClose={handleCloseFirstName}
            username={userData?.username}
            firstName={userData?.firstName}
          />
          <UpdateLastName
            open={openLastName}
            handleClose={handleCloseLastName}
            username={userData?.username}
            lastName={userData?.lastName}
          />
        </Box>
        <Stack
          direction="column"
          width="100%"
          alignItems="flex-start"
          marginTop="80px"
          gap={2}>
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap={1}>
            <PeopleIcon fontSize="medium" />
            <Typography variant="h5">My teams:</Typography>
          </Box>
          <Box display="flex" flexDirection="column" sx={myTeamsBoxStyle}>
            {myTeams.map((team) => (
              <TeamOwnerCard
                key={team.id}
                avatar={team.avatar}
                teamName={team.name}
                teamMembers={team.members}
                teamChannels={team.channels}
                teamId={team.id} />
            ))}
          </Box>
        </Stack>
      </Stack>
      <Divider textAlign="right" sx={{ width: '100%' }}>
        <Typography variant="h5">Created On: {profileState.createdOn}</Typography>
      </Divider>

    </Box>
  );
};

export default Profile;
