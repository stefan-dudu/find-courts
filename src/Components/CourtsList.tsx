import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Link from "@mui/material/Link";

import "./CourtsList.scss";

const CourtsList: React.FC = () => {
  const [courts, setCourts] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_COURT_GET_LINK || "");
      const data = await response.json();
      setCourts(data.body);
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };

  const getCourtStatusClass = (court: any) => {
    const occupiedUntil = new Date(court.occupiedUntil);
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours()); // Adjust for +2 hours

    const timeDiffInHours =
      (currentTime.getTime() - occupiedUntil.getTime()) / 3600000;

    // console.log("occupiedUntil", occupiedUntil);
    // console.log("currentTime", currentTime);
    // console.log(
    //   "timeDiffInHours >= 1 && timeDiffInHours <= 2",
    //   timeDiffInHours >= 1
    // );

    // if (court.available && timeDiffInHours >= 2) {
    //   return "available"; // If court is marked as available, it's available
    // }

    if (court.available && timeDiffInHours >= 2) {
      return "available";
    } else if (timeDiffInHours >= 0.1 && timeDiffInHours <= 2) {
      return "likely-available";
    } else {
      return "taken";
    }
  };

  const dotStyle1 = {
    width: "20px", // Set the width of the dot
    height: "20px", // Set the height of the dot
    borderRadius: "50%", // Make it a circle
    backgroundColor: "lightgreen", // Set the color of the dot
  };
  const dotStyle2 = {
    width: "20px", // Set the width of the dot
    height: "20px", // Set the height of the dot
    borderRadius: "50%", // Make it a circle
    backgroundColor: "#ffeeba", // Set the color of the dot
  };
  const dotStyle3 = {
    width: "20px", // Set the width of the dot
    height: "20px", // Set the height of the dot
    borderRadius: "50%", // Make it a circle
    backgroundColor: "#f5c6cb", // Set the color of the dot
  };

  return (
    <div>
      <div className="statusContainer">
        <div className="row">
          <h4>Last Checked In (Status):</h4>
        </div>
        <div className="row">
          <div style={dotStyle1}></div>
          {">"}2 hours ago (Available)
        </div>

        <div className="row">
          <div style={dotStyle2}></div>
          1-2 hours ago (Likely Available)
        </div>

        <div className="row">
          <div style={dotStyle3}></div>
          {"<"}1 hour ago (Taken)
        </div>
      </div>
      <div className="itemParent">
        {courts.map((court: any) => (
          <div
            key={court.courtID}
            className={`itemContainer ${getCourtStatusClass(court)}`}
          >
            <div className="name">{court.name}</div>
            {/* <div className="address">{court.address}</div> */}
            <div>
              <Link
                href={`${court.googleMapsLink}`}
                target="_blank"
                rel="noopener"
              >
                <a>{court.address}</a>
              </Link>
            </div>
            <strong>Court ID:</strong> {court.courtID} <br />
            <div className="surface">Surface: {court.surface}</div>
            <div className="lights">Lights: {court.lights ? "Yes" : "No"}</div>
            {/* {!court.available && <strong>Occupied Until:</strong>}
            {court.occupiedUntil ?? "Not occupied"} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtsList;
