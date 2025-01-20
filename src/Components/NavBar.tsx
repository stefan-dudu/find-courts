import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context"; // Import the auth hook
import "./NavBar.scss";
import Avatar from "@mui/material/Avatar";
import { green } from "@mui/material/colors";
import logo from "../assets/logo.png";
import Button from "@mui/material/Button";

type Props = {};

const NavBar = (props: Props) => {
  const auth = useAuth(); // Access the auth object
  const navigate = useNavigate();

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
        {/* <Link to="/">Home</Link>
        <br /> */}
        {/* <Link to="/courts/3">Court 3</Link>
        <br /> */}
        {/* <Link to="/about">About Us</Link> */}
      </div>
      <div>
        {/* <h4>Logo here</h4> */}
        {auth.isAuthenticated ? (
          <div className="authComponent">
            <span>Welcome </span>
            <Avatar sx={{ bgcolor: green[500] }}>{firstLetter}</Avatar>
            {/* <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button> */}
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
