import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context"; // Import the auth hook
import "./NavBar.scss";
import Avatar from "@mui/material/Avatar";
import { green } from "@mui/material/colors";
import logo from "../assets/logo.png";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { FormGroup, FormControlLabel } from "@mui/material"; // Import necessary MUI components
import Switch from "@mui/material/Switch"; // Import MUI Switch component
import { styled } from "@mui/material/styles";

// MaterialUI Switch Styling
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& + .MuiSwitch-track": {
        backgroundColor: "#4caf50",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
  },
}));

type Props = {};

const NavBar = (props: Props) => {
  const auth = useAuth(); // Access the auth object
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogin = () => {
    auth.signinRedirect(); // Redirect to login
  };

  const handleLogout = () => {
    auth.signoutRedirect(); // Redirect to logout
  };

  const firstLetter = auth.user?.profile.email[0].toUpperCase();

  return (
    <div className="parentComponent">
      <div className="linksComponent">
        <img src={logo} onClick={() => navigate("/")} />
      </div>

      <div>
        {auth.isAuthenticated ? (
          <div className="authComponent">
            <span>{t("navBar.welcome")} </span>
            <Avatar sx={{ bgcolor: green[500] }}>{firstLetter}</Avatar>
          </div>
        ) : (
          <Button onClick={handleLogin} variant="outlined" color="success">
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
