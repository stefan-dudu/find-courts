import React from "react";
import { useAuth } from "react-oidc-context";
import CourtsList from "../CourtsList.tsx";
import { Link } from "react-router-dom";
import NavBar from "../Components/NavBar.tsx";

type Props = {};

const Home = (props: Props) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div>
      <NavBar />
      <div>
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
        {/* <button onClick={() => signOutRedirect()}>Sign out</button> */}
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>

      {auth.isAuthenticated && "I AM AUTH"}
      <CourtsList />
      {/* <Courts /> */}
    </div>
  );
};

export default Home;
