import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.scss";

type Props = {};

const NavBar = (props: Props) => {
  return (
    <div className="parentComponent">
      {/* <h1>Welcome to the Court Reservation App</h1> */}
      <div className="linksComponent">
        <Link to="/">Home</Link>
        <br />
        <Link to="/courts/3">Court 3</Link>
        <br />
        <Link to="/about">About Us</Link>
      </div>
      <h4>Logo here</h4>
    </div>
  );
};

export default NavBar;
