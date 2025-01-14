import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
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
    if (court.available) {
      return "available"; // If court is marked as available, it's available
    }

    const occupiedUntil = new Date(court.occupiedUntil);
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours()); // Adjust for +2 hours

    const timeDiffInHours =
      (currentTime.getTime() - occupiedUntil.getTime()) / 3600000;

    // console.log("occupiedUntil", occupiedUntil);
    // console.log("currentTime", currentTime);

    if (timeDiffInHours > 2) {
      return "available";
    } else if (timeDiffInHours >= 1 && timeDiffInHours <= 2) {
      return "likely-available";
    } else {
      return "taken";
    }
  };

  const dotStyle1 = {
    width: "20px", // Set the width of the dot
    height: "20px", // Set the height of the dot
    borderRadius: "50%", // Make it a circle
    backgroundColor: "green", // Set the color of the dot
  };
  const dotStyle2 = {
    width: "20px", // Set the width of the dot
    height: "20px", // Set the height of the dot
    borderRadius: "50%", // Make it a circle
    backgroundColor: "yellow", // Set the color of the dot
  };
  const dotStyle3 = {
    width: "20px", // Set the width of the dot
    height: "20px", // Set the height of the dot
    borderRadius: "50%", // Make it a circle
    backgroundColor: "red", // Set the color of the dot
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
            <strong>Court ID:</strong> {court.courtID} <br />
            {"Adress: 1500 Alameda Drive"}
            {/* {!court.available && <strong>Occupied Until:</strong>}
            {court.occupiedUntil ?? "Not occupied"} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtsList;
