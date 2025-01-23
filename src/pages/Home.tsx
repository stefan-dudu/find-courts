import React from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import CourtsList from "../Components/CourtsList.tsx";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import BasicMap from "../Components/BasicMap.tsx";
import "./Home.scss";
import ball from "../assets/ball.png";
import { useTranslation } from "react-i18next";

type Props = {};

const Home = (props: Props) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [view, setView] = React.useState("courts");

  if (auth.isLoading) {
    return <div>{t("loading.loading")}</div>;
  }

  if (auth.error) {
    return (
      <div>
        {t("loading.error")} {auth.error.message}
      </div>
    );
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
    <div className="homeComponentWrapper">
      <main>
        <div className="heroSection">
          <h1>{t("hero.title")}</h1>
          <img src={ball} className="ball" alt="ball" />
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              navigate("/instructiuni");
            }}
          >
            {t("hero.howItWorks")}
          </Button>
        </div>
        <div className="toggleButton">
          <ToggleButtonGroup
            color="success"
            value={view}
            exclusive
            onChange={handleChange}
            aria-label="View Toggle"
          >
            <ToggleButton value="courts">{t("switch.courts")}</ToggleButton>
            <ToggleButton value="map">{t("switch.map")}</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div style={{ marginTop: "20px" }}>
          {view === "courts" ? <CourtsList /> : <BasicMap />}
        </div>
      </main>
    </div>
  );
};

export default Home;
