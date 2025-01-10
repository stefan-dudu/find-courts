import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";

const CourtsList: React.FC = () => {
  const [courts, setCourts] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    // Fetch courts when component mounts
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch("https://4vvelb2907.execute-api.eu-central-1.amazonaws.com/v1/courts");
      const data = await response.json();
      setCourts(data.body);
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };

  const handleCheckIn = async (courtID: string) => {
    if (!auth.isAuthenticated) {
      alert("You must be logged in to check in.");
      return;
    }

    const token = auth.user?.id_token; // Get the ID token from Cognito

    try {
      const response = await fetch("https://4vvelb2907.execute-api.eu-central-1.amazonaws.com/v1/checkin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ courtID })
      });

      if (response.ok) {
        alert("Check-in successful!");
        fetchCourts(); // Refresh courts list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error checking in:", error);
      alert("An error occurred during check-in.");
    }
  };
  console.log('courts', courts)

  return (
    <div>
      <h1>Courts</h1>
      <ul>
        {courts.map((court: any) => (
          <li key={court.courtID}>
            <strong>Court ID:</strong> {court.courtID} <br />
            <strong>Available:</strong> {court.available ? 'Yes' : 'No'} <br />
            <strong>Occupied Until:</strong> {court.occupiedUntil ?? 'Not occupied'}
            {court.available && (
              <button onClick={() => handleCheckIn(court.courtID)}>Check In</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourtsList;
