import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

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
      <h1>Courts</h1>
      <ul>
        {courts.map((court: any) => (
          <li key={court.courtID}>
            <strong>Court ID:</strong> {court.courtID} <br />
            <strong>Available:</strong> {court.available ? "Yes" : "No"} <br />
            <strong>Occupied Until:</strong>{" "}
            {court.occupiedUntil ?? "Not occupied"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourtsList;
