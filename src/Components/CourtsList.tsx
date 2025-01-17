import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

import "./CourtsList.scss";

const CourtsList: React.FC = () => {
  const [locations, setLocations] = useState([]);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
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
    }
  };

  const toggleLocation = (locationID: string) => {
    setExpandedLocation((prev) => (prev === locationID ? null : locationID));
  };

  const getCourtStatusClass = (court: any) => {
    const occupiedUntil = new Date(court.occupiedUntil);
    const currentTime = new Date();

    const timeDiffInHours =
      (currentTime.getTime() - occupiedUntil.getTime()) / 3600000;

    if (court.available && timeDiffInHours >= 2) {
      return "available";
    } else if (timeDiffInHours >= 0.1 && timeDiffInHours <= 2) {
      return "likely-available";
    } else {
      return "taken";
    }
  };

  return (
    <div className="parentWrapper">
      <Grid container spacing={2}>
        {locations.map((location: any) => {
          const availableCourts = location.courts.filter(
            (court: any) =>
              court.available &&
              (new Date().getTime() - new Date(court.occupiedUntil).getTime()) /
                3600000 >
                2
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
                2
          ).length;

          return (
            <Grid item xs={12} sm={6} md={6} key={location.locationID}>
              <div className="locationContainer">
                <div className="locationHeader">
                  <div>
                    <h3>{location.address}</h3>
                    <Link
                      href={`${location.googleMapsLink}`}
                      target="_blank"
                      rel="noopener"
                    >
                      View on Google Maps
                    </Link>
                  </div>
                  <div className="courtStatusSummary">
                    <span
                      className={`${
                        availableCourts === 0 ? "takenCount" : "availableCount"
                      }`}
                    >
                      {availableCourts} Available
                    </span>
                    {!!likelyAvailableCourts && (
                      <span className="likelyAvailableCount">
                        {likelyAvailableCourts} Likely Available
                      </span>
                    )}
                  </div>
                  {!allFieldsAvailable && (
                    <button
                      className="showCourtsButton"
                      onClick={() => toggleLocation(location.locationID)}
                    >
                      {expandedLocation === location.locationID
                        ? "Hide"
                        : "Show"}{" "}
                      Courts
                    </button>
                  )}
                </div>
                {expandedLocation === location.locationID && (
                  <div className="courtsParent">
                    {location.courts.map((court: any) => (
                      <div
                        key={court.courtID}
                        className={`courtItem ${getCourtStatusClass(court)}`}
                      >
                        <div className="courtDetails">
                          <h4>{court.name}</h4>
                          <h3>ID: {court.courtID}</h3>
                          <h3>
                            {court.available ? "Available" : "NOT Available"}
                          </h3>
                        </div>
                      </div>
                    ))}
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
