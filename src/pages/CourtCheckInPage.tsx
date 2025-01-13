import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar.tsx";

type Props = {};

const CourtCheckInPage = (props: Props) => {
  let { id } = useParams();
  const [court, setCourt] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_COURT_GET_LINK || "");
      const data = await response.json();
      setCourt(data.body.filter((el) => el.courtID == id)[0]);
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };

  const handleCheckIn = async (courtID: string) => {
    if (!auth.isAuthenticated) {
      alert("You must be logged in to check in.");
      return;
    }

    const token = auth.user?.id_token;

    try {
      const response = await fetch(
        process.env.REACT_APP_COURT_CHECKIN_LINK || "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courtID }),
        }
      );
      if (response.ok) {
        alert("Check-in successful!");
        fetchCourts();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error checking in:", error);
      alert("An error occurred during check-in.");
    }
  };

  return (
    <div>
      <NavBar />
      <h2>you are checking in on court {id}</h2>
      {auth.isAuthenticated ? "I AM AUTH" : "NOT AUTH"}
      {court.available && (
        <button onClick={() => handleCheckIn(id)}>Check In</button>
      )}
    </div>
  );
};

export default CourtCheckInPage;
