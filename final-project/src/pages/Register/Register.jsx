import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HowToRegIcon from '@mui/icons-material/HowToReg';

function Register() {
  const [view, setView] = useState(false);
  const handleVisibility = () => {
    setView(!view);
  };

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center">
      <Stack direction="column" spacing={4} sx={{ width: "350px" }}>
        <TextField label="Username:" variant="standard" size="small" required />
        <Stack direction="row" spacing={4}>
          <TextField
            label="First Name:"
            variant="standard"
            size="small"
            required
          />
          <TextField
            label="Second Name:"
            variant="standard"
            size="small"
            sx={{ width: "200px" }}
            required
          />
        </Stack>
        <TextField label="Email:" variant="standard" size="small" required />
        <TextField
          label="Password:"
          type={view ? "text" : "password"}
          variant="standard"
          size="small"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleVisibility}>
                  {view ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText="Do not share your password."
        />
      </Stack>
      <Stack>
        <Button variant="contained" size="medium" endIcon={<HowToRegIcon />}>
          Register
        </Button>
      </Stack>
    </Stack>
  );
}

export default Register;
