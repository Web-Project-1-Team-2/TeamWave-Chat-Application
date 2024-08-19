import { forwardRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { Alert, IconButton, InputAdornment, Snackbar } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { loginUser } from "../../services/auth.service";
import { AppContext } from "../../context/authContext";

const defaultTheme = createTheme();
const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert elevation={6} ref={ref} {...props} />;
});

export default function SignIn() {
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const [view, setView] = useState(false);
  const handleVisibility = () => {
    setView(!view);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  const login = async (event) => {
    event.preventDefault();
    if (!user.email || user.email.includes("@") === false) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email",
        severity: "error",
      });
      return;
    }

    try {
      const credential = await loginUser(user.email, user.password);
      setAppState({
        user: credential.user,
        userData: null,
      });
      console.log("Snackbar should open with success message");
      setSnackbar({
        open: true,
        message: "Login Successfull!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                'url("/static/images/templates/templates-images/sign-in-side-bg.png")',
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "left",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="p">
                Welcome back!
              </Typography>
              <Typography component="h2" variant="h6">
                We're glad to see you again!
              </Typography>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  variant="standard"
                  value={user.email}
                  onChange={updateUser("email")}
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  value={user.password}
                  onChange={updateUser("password")}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={view ? "text" : "password"}
                  autoComplete="current-password"
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={login}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to={"/register"}
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  mt={5}
                >
                  {"Copyright © "}
                  Name {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <SnackbarAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </SnackbarAlert>
      </Snackbar>
    </>
  );
}
