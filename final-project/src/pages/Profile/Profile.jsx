import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Avatar, Box, Typography } from "@mui/material";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import UpdateFirstName from "../../components/UpdateFirstName/UpdateFirstName";
import UpdateLastName from "../../components/UpdateLastName/UpdateLastName";
import { useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { db } from "../../config/firebase-config";


const Profile = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openFirstName, setOpenFirstName] = useState(false);
  const handleOpenFirstName = () => setOpenFirstName(true);
  const handleCloseFirstName = () => setOpenFirstName(false);

  const [openLastName, setOpenLastName] = useState(false);
  const handleOpenLastName = () => setOpenLastName(true);
  const handleCloseLastName = () => setOpenLastName(false);


  const { userData } = useContext(AppContext);
  
  const [profile, loadingProfile] = useObjectVal(ref(db, `users/${userData?.username}`));


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


  if (loadingProfile) return <div>Loading...</div>

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center" gap={3}>
      <Typography variant="h2" mb={3}>
        Profile
      </Typography>

      <Box display="flex" alignItems="center" mb={2} gap={3}>
        <Avatar
          src={profileState.avatar}
          sx={{ width: 100, height: 100, mr: 2, cursor: "pointer" }}
          onClick={handleOpen}
        >
          {!profileState.avatar &&
            (profileState.firstName
              ? profileState.firstName[0].toUpperCase() + profileState.lastName[0].toUpperCase()
              : "A")}
        </Avatar>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Typography>Username: {profileState.username}</Typography>
          <Typography sx={{ cursor: "pointer", textDecoration: "underline" }} onClick={handleOpenFirstName}>First Name: {profileState.firstName}</Typography>
          <Typography sx={{ cursor: "pointer", textDecoration: "underline" }} onClick={handleOpenLastName}>Last Name: {profileState.lastName}</Typography>
          <Typography >Created on: {profileState.createdOn}</Typography>
        </Box>
      </Box>
      <UploadAvatar
        open={open}
        handleClose={handleClose}
        avatar={profileState.avatar}
        username={profileState.username}
        uid={profileState.uid} />
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
  );
};

export default Profile;

