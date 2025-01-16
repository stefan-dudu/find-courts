import React from "react";
import { useAuth } from "react-oidc-context";
import CourtsList from "../Components/CourtsList.tsx";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import BasicMap from "../Components/BasicMap.tsx";
import "./Home.scss";

type Props = {};

const Home = (props: Props) => {
  const auth = useAuth();
  const [view, setView] = React.useState("courts");

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <div>
      <div>
        <h1>Know which public tennis courts are available right now </h1>

        <Button variant="contained" color="success">
          How does it work?
        </Button>
      </div>
      <div className="toggleButton">
        <ToggleButtonGroup
          color="primary"
          value={view}
          exclusive
          onChange={handleChange}
          aria-label="View Toggle"
        >
          <ToggleButton value="courts">Courts</ToggleButton>
          <ToggleButton value="map">Map</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div style={{ marginTop: "20px" }}>
        {view === "courts" ? <CourtsList /> : <BasicMap />}
      </div>
    </div>
  );
};

export default Home;
