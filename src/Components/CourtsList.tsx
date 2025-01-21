import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import "./CourtsList.scss";

const CourtsList: React.FC = () => {
  const [locations, setLocations] = useState([]);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_COURT_GET_LINK || "");
      const data = await response.json();
      setLocations(data.body);
    } catch (error) {
      console.error("Error fetching courts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = (locationID: string) => {
    setExpandedLocation((prev) => (prev === locationID ? null : locationID));
  };

  const getCourtStatusClass = (court: any) => {
    const occupiedUntil2 = new Date(court.occupiedUntil);

    const occupiedSince = new Date(occupiedUntil2);
    occupiedSince.setHours(occupiedSince.getHours() - 1);
    const currentTime = new Date();

    const timeDiffInHours =
      (currentTime.getTime() - occupiedSince.getTime()) / 3600000;

    if (court.available && timeDiffInHours >= 2) {
      return "available";
    } else if (timeDiffInHours >= 1 && timeDiffInHours <= 2) {
      return "likely-available";
    } else {
      return "taken";
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <p>{t("loading.courtInfo")}</p>
      </div>
    );
  }

  return (
    <div className="parentWrapper">
      <Grid container spacing={2}>
        {locations.map((location: any) => {
          const availableCourts = location.courts.filter(
            (court: any) =>
              court.available &&
              (new Date().getTime() - new Date(court.occupiedUntil).getTime()) /
                3600000 >
                1
          ).length;

          const allFieldsAvailable = location.courts.length === availableCourts;

          const likelyAvailableCourts = location.courts.filter(
            (court: any) =>
              court.available &&
              (new Date().getTime() - new Date(court.occupiedUntil).getTime()) /
                3600000 >
                0.1 &&
              (new Date().getTime() - new Date(court.occupiedUntil).getTime()) /
                3600000 <
                1
          ).length;

          const takenCourts = location.courts.filter(
            (court: any) => !court.available
          ).length;

          return (
            <Grid item xs={12} sm={6} md={6} key={location.locationID}>
              <div className="locationContainer">
                <div className="locationHeader">
                  <div>
                    <h3>{location.courtName}</h3>
                    <Link
                      href={`${location.googleMapsLink}`}
                      target="_blank"
                      rel="noopener"
                    >
                      {t("courtsList.viewOnMaps")}
                    </Link>
                  </div>
                  <div className="courtStatusSummary">
                    {!!availableCourts && (
                      <span
                        className={`${
                          availableCourts === 0
                            ? "takenCount"
                            : "availableCount"
                        }`}
                      >
                        {availableCourts} {t("courtsList.available")}
                      </span>
                    )}
                    {!!likelyAvailableCourts && (
                      <span className="likelyAvailableCount">
                        {likelyAvailableCourts}{" "}
                        {t("courtsList.likelyAvailable")}
                      </span>
                    )}
                    {!!takenCourts && (
                      <span className="takenCount">
                        {takenCourts} {t("courtsList.taken")}
                      </span>
                    )}
                  </div>
                  {!allFieldsAvailable && (
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => toggleLocation(location.locationID)}
                    >
                      {expandedLocation === location.locationID
                        ? `${t("courtsList.hideCourts")}`
                        : `${t("courtsList.showCourts")}`}
                    </Button>
                  )}
                </div>
                {expandedLocation === location.locationID && (
                  <div className="courtsParent">
                    {location.courts.map((court: any) => {
                      const statusClass = getCourtStatusClass(court);

                      const occupiedUntil = new Date(court.occupiedUntil);

                      const occupiedSince = new Date(occupiedUntil);
                      occupiedSince.setHours(occupiedSince.getHours() - 1);

                      const timeSinceOccupied = Math.round(
                        (new Date().getTime() - occupiedSince.getTime()) / 60000 // in minutes
                      );

                      return (
                        <div
                          key={court.courtID}
                          className={`courtItem ${statusClass}`}
                        >
                          <div className="courtDetails">
                            <h4>
                              #{court.courtID} -{" "}
                              {court.available
                                ? `${t("courtsList.available")}`
                                : `${t("courtsList.taken")}`}
                            </h4>
                            {statusClass === "likely-available" && (
                              <p>
                                {t("courtsList.lastTaken.likelyAvailable1")}{" "}
                                {timeSinceOccupied}{" "}
                                {t("courtsList.lastTaken.likelyAvailable2")}
                              </p>
                            )}
                            {statusClass === "taken" && (
                              <p>
                                {t("courtsList.lastTaken.taken1")}{" "}
                                {timeSinceOccupied}{" "}
                                {t("courtsList.lastTaken.taken2")}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default CourtsList;
