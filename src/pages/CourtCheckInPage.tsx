import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar.tsx";

type Props = {};

const CourtCheckInPage = (props: Props) => {
  const [court, setCourt] = useState([]);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  let { id } = useParams();
  const auth = useAuth();

  useEffect(() => {
    fetchCourts();
    getCoordinates();
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

  const getCoordinates = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setError(null); // Clear any previous errors
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      },
      {
        enableHighAccuracy: true, // Use high-accuracy mode (GPS)
        timeout: 10000, // Wait up to 10 seconds
        maximumAge: 0, // Don't use cached position
      }
    );
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

      <div>
        <h1>Get User Coordinates</h1>
        {/* <button onClick={getCoordinates}>Get My Location</button> */}
        {coordinates ? (
          <p>
            Latitude: {coordinates.lat}, Longitude: {coordinates.lng}
          </p>
        ) : (
          error && <p style={{ color: "red" }}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default CourtCheckInPage;
