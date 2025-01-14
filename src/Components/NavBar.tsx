import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const NavBar = (props: Props) => {
  return (
    <div>
      <h1>Welcome to the Court Reservation App</h1>
      {/* <Link to="/">Home</Link>
      <br />
      <Link to="/courts/3">Court 3</Link>
      <br />
      <Link to="/about">About Us</Link> */}
    </div>
  );
};

export default NavBar;
