import { useState } from "react";
import { updateLastName } from "../../../services/user.service";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { styleModal } from "../UpdateFirstName/UpdateFirstNameStyling";

function UpdateLastName({lastName, username, handleClose, open}) {
  console.log(lastName);

  const [newLastName, setNewLastName] = useState('');
  

  const updateNewLastName = async () => {
    if (!lastName) return;

    try {
      await updateLastName(username, newLastName);
      alert("Success");
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
      <Box sx={styleModal}>
        <Typography id="modal-modal-title" variant="h6">
          Change your Last Name
        </Typography>
        <TextField
          label="Last Name"
          value={newLastName}
          onChange={(e) => {
            setNewLastName(e.target.value);
          }}
        />
        <Stack direction="row" spacing={4} mt={3}>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={updateNewLastName}
            >
              Save
            </Button>
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

UpdateLastName.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  lastName: PropTypes.string,
};

export default UpdateLastName;
