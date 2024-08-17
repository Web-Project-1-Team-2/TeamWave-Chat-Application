import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { forwardRef, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { constrains } from "../../common/constraints";
import { createUser, getUserByUsername } from "../../services/user.service";
import { registerUser } from "../../services/auth.service";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { AppContext } from "../../context/authContext";

function Register() {
  const [view, setView] = useState(false);
  const handleVisibility = () => {
    setView(!view);
  };

  const SnackbarAlert = forwardRef(
    function SnackbarAlert(props, ref) {
      return <Alert elevation={6} ref={6} {...props} />
    }
  )

  // const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {
      username:
        !user.username ||
        user.username.length < constrains.NAMES_MIN_LENGTH ||
        user.username.length > constrains.NAMES_MAX_LENGTH,
      firstName:
        !user.firstName ||
        user.firstName.length < constrains.NAMES_MIN_LENGTH ||
        user.firstName.length > constrains.NAMES_MAX_LENGTHfirstName,
      lastName:
        !user.lastName ||
        user.lastName.length < constrains.NAMES_MIN_LENGTH ||
        user.lastName.length > constrains.NAMES_MAX_LENGTHfirstNamelastName,
      email: !user.email || user.email.includes("@") === false,
      password: !user.password
        .split("")
        .some((char) => char !== " " && !isNaN(char)),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const register = async () => {
    const dbUser = await getUserByUsername(user.username);
    console.log(dbUser);
    if (dbUser) {
      <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}>
            <SnackbarAlert severity = "error">
            User already exists!
            </SnackbarAlert>
          </Snackbar>
      setUser({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      return;
    }

    if (validateForm()) {
      try {
        const credential = await registerUser(user.email, user.password);
        await createUser(
          user.firstName,
          user.lastName,
          user.username,
          credential.user.uid,
          user.email
        );
        setAppState({
          user: credential.user,
          userData: null,
        });
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}>
            <SnackbarAlert severity = "success">
            Registration successful!
            </SnackbarAlert>
          </Snackbar>
        setTimeout(() => {
          navigate(location.state?.from.pathname ?? "/");
        }, 1000);
      } catch (error) {
        console.log(error);
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}>
            <SnackbarAlert severity = "error">
            {error.message}
            </SnackbarAlert>
          </Snackbar>
      }
    }
  };

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center">
      <Stack direction="column" spacing={4} sx={{ width: "350px" }}>
        <TextField
          label="Username:"
          variant="standard"
          size="small"
          required
          value={user.username}
          onChange={updateUser("username")}
          error={errors.username}
          helperText={errors.username && `Username is required`}
        />
        <Stack direction="row" spacing={4}>
          <TextField
            label="First Name:"
            variant="standard"
            size="small"
            required
            value={user.firstName}
            onChange={updateUser("firstName")}
            error={errors.firstName}
            helperText={errors.firstName && "First Name is required"}
          />
          <TextField
            label="Second Name:"
            variant="standard"
            size="small"
            sx={{ width: "200px" }}
            required
            value={user.lastName}
            onChange={updateUser("lastName")}
            error={errors.lastName}
            helperText={errors.lastName && "Last Name is required"}
          />
        </Stack>
        <TextField
          label="Email:"
          variant="standard"
          size="small"
          required
          value={user.email}
          onChange={updateUser("email")}
          error={errors.email}
          helperText={errors.email && "Email is required"}
        />
        <TextField
          label="Password:"
          type={view ? "text" : "password"}
          variant="standard"
          size="small"
          required
          value={user.password}
          onChange={updateUser("password")}
          error={errors.password}
          helperText={
            errors.password
              ? "Password is required"
              : "Do not share your password."
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleVisibility}>
                  {view ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack>
        <Button
          variant="contained"
          size="medium"
          endIcon={<HowToRegIcon />}
          onClick={register}
        >
          Register
        </Button>
      </Stack>
    </Stack>
  );
}

export default Register;
