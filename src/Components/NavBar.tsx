import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import "./NavBar.scss";
import Avatar from "@mui/material/Avatar";
import { green } from "@mui/material/colors";
import logo from "../assets/logo.png";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

type Props = {};

const NavBar = (props: Props) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const firstLetter =
    auth?.user?.profile.email && auth.user.profile.email[0].toUpperCase();

  return (
    <div className="parentComponent">
      <div className="linksComponent">
        <img src={logo} onClick={() => navigate("/")} alt="home-logo" />
      </div>

      <div>
        {auth.isAuthenticated ? (
          <div className="authComponent">
            <span>{t("navBar.welcome")} </span>
            <Avatar sx={{ bgcolor: green[500] }}>{firstLetter}</Avatar>
          </div>
        ) : (
          // TODO: disabled for the moment, until full implementation - cognito & ULR - localhost to domain
          // <Button onClick={handleLogin} variant="outlined" color="success">
          //   Login
          // </Button>
          <></>
        )}
      </div>
    </div>
  );
};

export default NavBar;
