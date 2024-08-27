import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import UploadAvatar from "../../components/User/UploadAvatar/UploadAvatar";
import UpdateLastName from "../../components/User/UpdateLastName/UpdateLastName";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import UpdateFirstName from "../../components/User/UpdateFirstName/UpdateFirstName";
import EditIcon from "@mui/icons-material/Edit";
import TeamOwnerCard from "../../components/Teams/TeamOwnerCard/TeamOwnerCard";
import { changeTeamAvatar } from "./ProfilePageStyling";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Profile = () => {

  const { userData } = useContext(AppContext);

  const [teams] = useListVals(ref(db, `teams`));
  const [myTeams, setMyTeams] = useState([]);

  useEffect(() => {
    if (!teams || !userData) return;
    const ownerTeams = teams.filter((team) => team.owner === userData.username);
    setMyTeams(ownerTeams);
  }, [teams, userData]);

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
  });

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
      <Typography variant="h3" mb={3}>
        {" "}
        Profile
      </Typography>

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
            mb={2}
            gap={3}
            sx={{ mb: "150px" }}
          >
            <Avatar
              onMouseEnter={toggleIsHovering}
              src={profileState.avatar}
              sx={{ width: 200, height: 200 }}
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
                <AddPhotoAlternateIcon sx={{ fontSize: 50 }} />
              </div>
            }

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap={3}
            >
              <Typography>Username: {profileState.username}</Typography>
              <Stack>
                <Typography>
                  First Name: {profileState.firstName}
                  <IconButton>
                    <EditIcon cursor="pointer" onClick={handleOpenFirstName} />
                  </IconButton>
                </Typography>
              </Stack>
              <Stack>
                <Typography>
                  Last Name: {profileState.lastName}
                  <IconButton>
                    <EditIcon cursor="pointer" onClick={handleOpenLastName} />
                  </IconButton>
                </Typography>
              </Stack>
              <Typography>Created on: {profileState.createdOn}</Typography>
            </Box>
          </Box>
          <UploadAvatar
            open={open}
            handleClose={handleClose}
            avatar={profileState.avatar}
            username={profileState.username}
            uid={profileState.uid}
          />
          <UpdateFirstName
            open={openFirstName}
            handleClose={handleCloseFirstName}
            username={profileState.username}
            firstName={profileState.firstName}
          />
          <UpdateLastName
            open={openLastName}
            handleClose={handleCloseLastName}
            username={profileState.username}
            lastName={profileState.lastName}
          />
        </Box>
        <Stack direction="column" spacing={1} width="100%" alignItems="center">
          <Box
            width="100%"
            display="flex"
            textAlign="center"
            justifyContent="center"
          >
            <Typography variant="h5">My teams:</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            sx={{ height: "400px", overflow: "auto", width: "350px" }}
          >
            {myTeams.map((team) => (
              <TeamOwnerCard
                key={team.key}
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
    </Box>
  );
};

export default Profile;
