"use client";
import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { CourtLocation, CourtType } from "@/types/courts";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapComponent = () => {
  const [courts, setCourts] = useState([]);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_COURT_GET_LINK || ""
      );
      const data = await response.json();
      setCourts(data.body); // Adjusted to match your example response structure
    } catch (error) {
      console.error("Error fetching courts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <p>{t("loading.mapInfo")}</p>
      </div>
    );
  }

  return (
    // <div style={{ height: "500px", width: "100%" }}>
    <div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>
      <Map
        initialViewState={{
          longitude: 26.10249131839039,
          latitude: 44.42677583105836,
          zoom: 11.5,
        }}
        // style={{ width: "100%", height: "100%" }}
        style={{
          position: "relative",
          width: "100%",
          height: "70vh",
        }}
        // mapStyle="mapbox://styles/mapbox/outdoors-v12"
        // mapStyle="mapbox://styles/stefan01-dev/cm657r5k900c401sgbcuofev4"
        mapStyle="mapbox://styles/stefan01-dev/cmhvtbqtw00fv01qu4tkreear"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {courts.length > 0 &&
          courts.map((court: CourtLocation) => (
            <Marker
              key={court.locationID}
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
            offset={-15}
          >
            <div>
              <h2>{popupInfo.courtName}</h2>
              <p>
                {t("map.noOfCourts")} {popupInfo.courts.length}
              </p>
            </div>
          </Popup>
        )}
      </Map>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
    </div>
  );
};

export default MapComponent;
