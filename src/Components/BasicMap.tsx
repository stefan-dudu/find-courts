import React from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // Replace with your token

const BasicMap = () => {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Map
        initialViewState={{
          longitude: 26.03131711559266, // Example coordinates (replace with yours)
          latitude: 44.436216112648516,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        // mapStyle="mapbox://styles/stefan01-dev/cle6x947u005b01nojysmi80b"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker
          longitude={26.029718027493107}
          latitude={44.42155063043167}
          color="green"
        />
        <Marker
          longitude={26.04280437854174}
          latitude={44.461066648146485}
          color="green"
        />
      </Map>
    </div>
  );
};

export default BasicMap;
