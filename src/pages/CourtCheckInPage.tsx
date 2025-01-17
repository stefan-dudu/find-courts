import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

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

      const filteredCourt = data.body
        .map((location) => ({
          ...location,
          courts: location.courts.filter((court) => court.courtID === id),
        }))
        .filter((el) => el.courts.length > 0);
      setCourt(filteredCourt[0].courts[0]);
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
      // alert("You must be logged in to check in.");
      auth.signinRedirect();
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

  const EARTH_RADIUS = 6371000; // Earth's radius in meters

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c; // Distance in meters
  };

  const isWithinRadius = (
    userLat: number,
    userLon: number,
    courtLat: number,
    courtLon: number,
    radius: number
  ) => {
    const distance = haversineDistance(userLat, userLon, courtLat, courtLon);
    return distance <= radius;
  };

  // Example usage
  const userLat = coordinates?.lat || 44.426988;
  const userLon = coordinates?.lng || 26.015445;
  const courtLat = 44.427225; // close
  // const courtLat = 44.426382; // far
  const courtLon = 26.015756;
  const radius = 50; // 50 meters

  if (isWithinRadius(userLat, userLon, courtLat, courtLon, radius)) {
    console.log("User is within 50 meters of the court");
  } else {
    console.log("User is not within 50 meters of the court");
  }

  return (
    <div>
      <div>
        <div>
          {isWithinRadius(userLat, userLon, courtLat, courtLon, radius) ? (
            court.available ? (
              <div>
                <h2>You are about to check in on court {id}</h2>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleCheckIn(id)}
                >
                  Check in
                </Button>
              </div>
            ) : (
              <h2>Sorry, court already taken</h2>
            )
          ) : (
            <h2>Please get closer to the tennis field - within 50m</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourtCheckInPage;
