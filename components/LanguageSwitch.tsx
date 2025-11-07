"use client"
import React from "react";
import { FormGroup, FormControlLabel } from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import '@/i18n';
// import "./LanguageSwitch.scss";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

type Props = {};

const LanguageSwitch = (props: Props) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLang = event.target.checked ? "en" : "ro";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="langWrapper">
      <FormGroup>
        <FormControlLabel
          sx={{ gap: 2 }}
          control={
            <IOSSwitch
              checked={i18n.language === "en"}
              onChange={handleLanguageChange}
              name="language-switch"
            />
          }
          label={
            i18n.language === "en" ? (
              <span role="img" aria-label="english">
                {" "}
                English
              </span>
            ) : (
              <span role="img" aria-label="romanian">
                {" "}
                Română
              </span>
            )
          }
        />
      </FormGroup>
    </div>
  );
};

export default LanguageSwitch;