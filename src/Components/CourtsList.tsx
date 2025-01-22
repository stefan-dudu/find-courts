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

  const dummy = [
    {
      courts: [
        {
          available: true,
          name: "Court 5",
          occupiedUntil: "2025-01-20T11:23:09.874336",
          surface: "Tartan",
          lights: true,
          courtID: "5",
        },
      ],
      googleMapsLink: "https://maps.app.goo.gl/C8g62sqJgnEQduAK8",
      locationID: "2",
      address: "Drumul Taberei 53, București 061362",
      coordinates: [44.421714958074254, 26.030068288094757],
      courtName: "Parcul Drumul Taberei",
    },
    {
      courts: [
        {
          available: true,
          name: "Court 1",
          occupiedUntil: "2025-01-18T20:24:35.902708",
          surface: "Tartan",
          lights: true,
          courtID: "1",
        },
        {
          available: true,
          courtID: "2",
          lights: false,
          name: "Court 2",
          occupiedUntil: "2025-01-22T10:00:03.813622",
          surface: "Tartan",
        },
        {
          available: false,
          courtID: "3",
          lights: false,
          name: "Court 3",
          occupiedUntil: "2025-01-22T11:31:17.411916",
          surface: "Tartan",
        },
        {
          available: true,
          name: "Court 4",
          occupiedUntil: "2025-01-20T14:08:13.252996",
          surface: "Tartan",
          lights: false,
          courtID: "4",
        },
      ],
      googleMapsLink: "https://maps.app.goo.gl/182ua82Pqp9G67N48",
      locationID: "1",
      address: "Drumul Lunca Cetății 211",
      coordinates: [44.40045060210415, 26.17353510803108],
      courtName: "Parc Sportiv Lunca Cetății",
    },
    {
      courts: [
        {
          available: false,
          courtID: "9",
          lights: false,
          name: "Court 9",
          occupiedUntil: "2025-01-22T11:00:28.895782",
          surface: "Tartan",
        },
        {
          available: true,
          name: "Court 10",
          occupiedUntil: "2025-01-18T12:26:58.955099",
          surface: "Tartan",
          lights: false,
          courtID: "10",
        },
      ],
      googleMapsLink: "https://maps.app.goo.gl/PbWrLTe2zuz2NRAh9",
      locationID: "4",
      address: "Calea Giulești",
      coordinates: [44.460807050214385, 26.04390284599664],
      courtName: "Parcul Marin Preda",
    },
    {
      courts: [
        {
          available: true,
          name: "Court 6",
          occupiedUntil: "2025-01-21T15:36:31.705315",
          surface: "Tartan",
          lights: true,
          courtID: "6",
        },
        {
          available: true,
          name: "Court 7",
          occupiedUntil: "2025-01-18T19:26:58.955099",
          surface: "Tartan",
          lights: true,
          courtID: "7",
        },
        {
          available: false,
          courtID: "8",
          lights: true,
          name: "Court 8",
          occupiedUntil: "2025-01-22T11:31:33.413979",
          surface: "Tartan",
        },
      ],
      googleMapsLink: "https://maps.app.goo.gl/ummyXqJnMi9by3vs6",
      locationID: "3",
      address: "Bulevardul Unirii",
      coordinates: [44.4254754065915, 26.116106045190428],
      courtName: "Unirii",
    },
  ];

  const fetchCourts = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_COURT_GET_LINK || "");
      const data = await response.json();
      setLocations(dummy);
    } catch (error) {
      console.error("Error fetching courts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = (locationID: string) => {
    setExpandedLocation((prev) => (prev === locationID ? null : locationID));
  };

  const now = 1737534968461;

  const getCourtStatusClass = (court: any) => {
    const occupiedUntil2 = new Date(court.occupiedUntil);

    const occupiedSince = new Date(occupiedUntil2);
    occupiedSince.setHours(occupiedSince.getHours() - 1);
    const currentTime = new Date();
    console.log("currentTime.getTime()", currentTime.getTime());

    const timeDiffInHours = (now - occupiedSince.getTime()) / 3600000;

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

  console.log("locations", locations);

  return (
    <div className="parentWrapper">
      <Grid container spacing={2}>
        {locations.map((location: any) => {
          const availableCourts = location.courts.filter(
            (court: any) =>
              court.available &&
              (now - new Date(court.occupiedUntil).getTime()) / 3600000 > 1
          ).length;

          const allFieldsAvailable = location.courts.length === availableCourts;

          const likelyAvailableCourts = location.courts.filter(
            (court: any) =>
              court.available &&
              (now - new Date(court.occupiedUntil).getTime()) / 3600000 > 0.1 &&
              (now - new Date(court.occupiedUntil).getTime()) / 3600000 < 1
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
                        (now - occupiedSince.getTime()) / 60000 // in minutes
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
