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

  console.log("courts", courts);

  return (
    <div>
      {/* <h1>Courts</h1> */}
      <div className="itemParent">
        {courts.map((court: any) => (
          <div key={court.courtID} className="itemContainer">
            <strong>Court ID:</strong> {court.courtID} <br />
            <strong>Available:</strong> {court.available ? "Yes" : "No"} <br />
            {!court.available && <strong>Occupied Until:</strong>}
            {court.occupiedUntil ?? "Not occupied"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtsList;
