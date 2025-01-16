import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // Replace with your token

const BasicMap = () => {
  const [courts, setCourts] = useState([]);

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

  const MarkerComponent = () => {
    return (
      <>
        {courts.map((el: any) => {
          return (
            <Marker
              longitude={el.coordinates[1]}
              latitude={el.coordinates[0]}
            ></Marker>
          );
        })}
      </>
    );
  };

  console.log("courts", courts);
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Map
        initialViewState={{
          longitude: 26.03131711559266,
          latitude: 44.436216112648516,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        // mapStyle="mapbox://styles/stefan01-dev/cle6x947u005b01nojysmi80b"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <MarkerComponent />
      </Map>
    </div>
  );
};

export default BasicMap;
