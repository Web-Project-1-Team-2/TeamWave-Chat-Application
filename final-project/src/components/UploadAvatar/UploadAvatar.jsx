import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { deleteImage, uploadImage } from "../../services/storage.service";
import { setImageUrl } from "../../services/user.service";
import { notifySuccess } from "../../services/notification.service";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function UploadAvatar({ open, handleClose, avatar, uid, username }) {
  const [image, setImage] = useState(null);

  const UploadAndSetAvatar = async () => {
    if (!image) return;

    try {
      if (avatar !== "") {
        await deleteImage(username, uid);
      }
      const uploadedImage = await uploadImage(image, uid, username);
      await setImageUrl(username, uploadedImage);
      notifySuccess("Avatar uploaded successfully.")
      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6">
          Change your profile picture
        </Typography>
        <Box mt={2}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Box>
        <Stack direction="row" spacing={4} mt={3}>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={UploadAndSetAvatar}
          >
            Upload
          </Button>
        </Box>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

UploadAvatar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default UploadAvatar;
