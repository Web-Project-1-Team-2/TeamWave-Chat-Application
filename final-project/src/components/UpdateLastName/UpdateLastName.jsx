import { useState } from "react";
import { deleteLastName, updateLastName } from "../../services/user.service";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

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

function UpdateLastName({
    lastName,
    username,
    handleClose,
    open,
    handleUpdate,
  }) {
  const [newLastName, setNewLastName] = useState(null);

  const UpdateNewLastName = async () => {
    if (!lastName) return;

    try {
      if (lastName !== "") {
        await deleteLastName(username);
      }
      await updateLastName(username, newLastName);
      await handleUpdate(newLastName);
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
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6">
          Change your Last Name
        </Typography>
        <TextField
          label="First Name"
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
              onClick={UpdateNewLastName}
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
  handleUpdate: PropTypes.func.isRequired,
};

export default UpdateLastName;
