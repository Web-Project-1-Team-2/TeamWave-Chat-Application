import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/authContext";
import { Typography } from "@mui/material";



const Profile = () => {


  const { userData } = useContext(AppContext);
  const [data, setData] = useState({
    avatar: "",
    uid: "",
    username: "",
  });

  useEffect(() => {
    if (!userData) return;
    setData({
      ...userData,
      avatar: userData.avatar || "",
      username: userData.username || "",
      uid: userData.uid || "",
    });
  }, [userData]);

  return (
    <Typography>{data.username}</Typography>
  )
};

export default Profile;

