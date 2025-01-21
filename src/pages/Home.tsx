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
import { FormGroup, FormControlLabel } from "@mui/material"; // Import necessary MUI components
import Switch from "@mui/material/Switch"; // Import MUI Switch component
import { styled } from "@mui/material/styles";

type Props = {};

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

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLang = event.target.checked ? "en" : "ro"; // Toggle between English and Romanian
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="homeComponentWrapper">
      <main>
        <div className="heroSection">
          <h1>{t("hero.title")}</h1>
          <img src={ball} className="ball" />
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
      <footer>
        <FormGroup>
          <FormControlLabel
            control={
              <MaterialUISwitch
                checked={i18n.language === "en"}
                onChange={handleLanguageChange}
                name="language-switch"
                color="primary"
              />
            }
            label={
              i18n.language === "en" ? (
                <span role="img" aria-label="english">
                  English
                </span>
              ) : (
                <span role="img" aria-label="romanian">
                  Română
                </span>
              )
            }
          />
        </FormGroup>
      </footer>
    </div>
  );
};

export default Home;
