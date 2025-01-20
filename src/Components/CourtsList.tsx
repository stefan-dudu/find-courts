import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

import "./CourtsList.scss";

const CourtsList: React.FC = () => {
  const [locations, setLocations] = useState([]);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuth();

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
        <p>Loading court information...</p>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
  //       <p>{error}</p>
  //     </div>
  //   );
  // }

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
                      View on Google Maps
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
                        {availableCourts} Available
                      </span>
                    )}
                    {!!likelyAvailableCourts && (
                      <span className="likelyAvailableCount">
                        {likelyAvailableCourts} Likely Available
                      </span>
                    )}
                    {!!takenCourts && (
                      <span className="takenCount">{takenCourts} Taken</span>
                    )}
                  </div>
                  {!allFieldsAvailable && (
                    // <button
                    //   className="showCourtsButton"
                    //   onClick={() => toggleLocation(location.locationID)}
                    // >
                    //   {expandedLocation === location.locationID
                    //     ? "Hide"
                    //     : "Show"}{" "}
                    //   Courts
                    // </button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => toggleLocation(location.locationID)}
                    >
                      {expandedLocation === location.locationID
                        ? "Hide"
                        : "Show"}{" "}
                      Courts
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
                            {/* <h4>{court.name}</h4> */}
                            <h4>
                              #{court.courtID} -{" "}
                              {court.available ? "Available" : "Not Available"}
                            </h4>
                            {/* <h3>
                              {court.available ? "Available" : "Not Available"}
                            </h3> */}
                            {statusClass === "likely-available" && (
                              <p>
                                Last taken {timeSinceOccupied} minutes ago,
                                might be available.
                              </p>
                            )}
                            {statusClass === "taken" && (
                              <p>
                                Currently occupied, taken {timeSinceOccupied}{" "}
                                minutes ago.
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
