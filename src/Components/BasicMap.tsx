import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // Replace with your token

const BasicMap = () => {
  const [courts, setCourts] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_COURT_GET_LINK || "");
      const data = await response.json();
      setCourts(data.body); // Adjusted to match your example response structure
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Map
        initialViewState={{
          longitude: 26.10249131839039,
          latitude: 44.42677583105836,
          zoom: 11.1,
        }}
        // style={{ width: "100%", height: "100%" }}
        style={{
          position: "relative",
          width: "100%",
          height: "70vh",
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {courts.length > 0 &&
          courts.map((court) => (
            <Marker
              key={court.courtID}
              longitude={court.coordinates[1]}
              latitude={court.coordinates[0]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation(); // Prevent map click from triggering
                setPopupInfo(court);
              }}
            ></Marker>
          ))}

        {popupInfo && (
          <Popup
            longitude={popupInfo.coordinates[1]}
            latitude={popupInfo.coordinates[0]}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            <div>
              <h3>{popupInfo.name}</h3>
              <p>
                Available: {popupInfo.available ? "Yes" : "No"}
                <br />
                Surface: Hard
                <br />
                Lights: Yes
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default BasicMap;
