"use client";
import { CourtsType } from "@/types/courts";
import React, { useState } from "react";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

const Court = ({ data }: any) => {
//   console.log("Data in Court component:", data);
  let locations = data;
  //   locations =  [
  //     {
  //       courts: [
  //         {
  //           available: true,
  //           name: "Court 5",
  //           occupiedUntil: "2025-01-20T11:23:09.874336",
  //           surface: "Tartan",
  //           lights: true,
  //           courtID: "5",
  //         },
  //       ],
  //       googleMapsLink: "https://maps.app.goo.gl/C8g62sqJgnEQduAK8",
  //       locationID: "2",
  //       address: "Drumul Taberei 53, București 061362",
  //       coordinates: [44.421714958074254, 26.030068288094757],
  //       courtName: "Parcul Drumul Taberei",
  //     },
  //     {
  //       courts: [
  //         {
  //           available: true,
  //           name: "Court 1",
  //           occupiedUntil: "2025-01-18T20:24:35.902708",
  //           surface: "Tartan",
  //           lights: true,
  //           courtID: "1",
  //         },
  //         {
  //           available: true,
  //           courtID: "2",
  //           lights: false,
  //           name: "Court 2",
  //           occupiedUntil: "2025-11-05T16:00:03.813622",
  //           surface: "Tartan",
  //         },
  //         {
  //           available: false,
  //           courtID: "3",
  //           lights: false,
  //           name: "Court 3",
  //           occupiedUntil: "2025-01-22T11:31:17.411916",
  //           surface: "Tartan",
  //         },
  //         {
  //           available: true,
  //           name: "Court 4",
  //           occupiedUntil: "2025-01-20T14:08:13.252996",
  //           surface: "Tartan",
  //           lights: false,
  //           courtID: "4",
  //         },
  //       ],
  //       googleMapsLink: "https://maps.app.goo.gl/182ua82Pqp9G67N48",
  //       locationID: "1",
  //       address: "Drumul Lunca Cetății 211",
  //       coordinates: [44.40045060210415, 26.17353510803108],
  //       courtName: "Parc Sportiv Lunca Cetății",
  //     },
  //     {
  //       courts: [
  //         {
  //           available: false,
  //           courtID: "9",
  //           lights: false,
  //           name: "Court 9",
  //           occupiedUntil: "2025-01-22T11:00:28.895782",
  //           surface: "Tartan",
  //         },
  //         {
  //           available: true,
  //           name: "Court 10",
  //           occupiedUntil: "2025-01-18T12:26:58.955099",
  //           surface: "Tartan",
  //           lights: false,
  //           courtID: "10",
  //         },
  //       ],
  //       googleMapsLink: "https://maps.app.goo.gl/PbWrLTe2zuz2NRAh9",
  //       locationID: "4",
  //       address: "Calea Giulești",
  //       coordinates: [44.460807050214385, 26.04390284599664],
  //       courtName: "Parcul Marin Preda",
  //     },
  //     {
  //       courts: [
  //         {
  //           available: true,
  //           name: "Court 6",
  //           occupiedUntil: "2025-01-21T15:36:31.705315",
  //           surface: "Tartan",
  //           lights: true,
  //           courtID: "6",
  //         },
  //         {
  //           available: true,
  //           name: "Court 7",
  //           occupiedUntil: "2025-01-18T19:26:58.955099",
  //           surface: "Tartan",
  //           lights: true,
  //           courtID: "7",
  //         },
  //         {
  //           available: false,
  //           courtID: "8",
  //           lights: true,
  //           name: "Court 8",
  //           occupiedUntil: "2025-01-22T11:31:33.413979",
  //           surface: "Tartan",
  //         },
  //       ],
  //       googleMapsLink: "https://maps.app.goo.gl/ummyXqJnMi9by3vs6",
  //       locationID: "3",
  //       address: "Bulevardul Unirii",
  //       coordinates: [44.4254754065915, 26.116106045190428],
  //       courtName: "Unirii",
  //     },
  //   ];

  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const toggleLocation = (locationID: string) => {
    setExpandedLocation((prev) => (prev === locationID ? null : locationID));
  };

  const getCourtStatusClass = (court: any) => {
    const occupiedUntil2 = new Date(court.occupiedUntil);
    const occupiedSince = new Date(occupiedUntil2);
    occupiedSince.setHours(occupiedSince.getHours() - 1);
    const currentTime = new Date();
    const timeDiffInHours =
      (currentTime.getTime() - occupiedSince.getTime()) / 3600000;

    if (court.available && timeDiffInHours >= 2) {
      return "available";
    } else if (timeDiffInHours >= 1 && timeDiffInHours <= 2) {
      return "likely-available";
    } else {
      return "taken";
    }
  };

  return (
    <div className="flex w-full flex-row flex-wrap justify-center">
      <Grid container spacing={2}>
        {locations.map((location: any) => {
          const availableCourts = location.courts.filter(
            (court: any) =>
              court.available &&
              (new Date().getTime() - new Date(court.occupiedUntil).getTime()) /
                3600000 >
                1
          ).length;

          const allFieldsAvailable = location.courts.length === availableCourts;

          const likelyAvailableCourts = location.courts.filter(
            (court: any) =>
              court.available &&
              (new Date().getTime() - new Date(court.occupiedUntil).getTime()) /
                3600000 >
                0.1 &&
              (new Date().getTime() - new Date(court.occupiedUntil).getTime()) /
                3600000 <
                1
          ).length;

          const takenCourts = location.courts.filter(
            (court: any) => !court.available
          ).length;

          return (
            <div
              key={location.locationID}
              className="w-[320px] sm:w-[420px] bg-white rounded-xl p-5 m-5 shadow-2xl text-center"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-left">
                  <h3 className="text-lg font-semibold">
                    {location.courtName}
                  </h3>
                  {location.googleMapsLink && (
                    <Link href={location.googleMapsLink}>
                      <a
                        className="text-sm text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t ? t("courtsList.viewOnMaps") : "View on Maps"}
                      </a>
                    </Link>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col items-end gap-1">
                    {availableCourts > 0 && (
                      <span className="text-green-600 font-semibold text-sm">
                        {availableCourts}{" "}
                        {t ? t("courtsList.available") : "available"}
                      </span>
                    )}
                    {likelyAvailableCourts > 0 && (
                      <span className="text-amber-600 font-semibold text-sm">
                        {likelyAvailableCourts}{" "}
                        {t
                          ? t("courtsList.likelyAvailable")
                          : "likely available"}
                      </span>
                    )}
                    {takenCourts > 0 && (
                      <span className="text-rose-600 font-semibold text-sm">
                        {takenCourts} {t ? t("courtsList.taken") : "taken"}
                      </span>
                    )}
                  </div>

                  {
                    <button
                      onClick={() => toggleLocation(location.locationID)}
                      //   onClick={() => console.log(location.locationID)}
                      className="mt-2 text-sm px-3 py-1 rounded border border-green-600 text-green-700 hover:bg-green-50"
                    >
                      {expandedLocation === location.locationID
                        ? t
                          ? t("courtsList.hideCourts")
                          : "Hide courts"
                        : t
                        ? t("courtsList.showCourts")
                        : "Show courts"}
                    </button>
                  }
                </div>
              </div>

              {expandedLocation === location.locationID && (
                <div className="mt-4 grid gap-3">
                  {location.courts.map((court) => {
                    const statusClass = getCourtStatusClass(court);
                    const occupiedUntil = new Date(court.occupiedUntil);
                    const occupiedSince = new Date(occupiedUntil);
                    occupiedSince.setHours(occupiedSince.getHours() - 1);
                    const timeSinceOccupied = Math.round(
                      (new Date().getTime() - occupiedSince.getTime()) / 60000
                    );

                    const statusStyles =
                      statusClass === "available"
                        ? "bg-green-100 border-l-4 border-green-500"
                        : statusClass === "likely-available"
                        ? "bg-amber-100 border-l-4 border-amber-500"
                        : "bg-rose-100 border-l-4 border-rose-500";

                    return (
                      <div
                        key={court.courtID}
                        className={`flex items-start p-3 rounded-md ${statusStyles}`}
                      >
                        <div className="text-left">
                          <h4 className="text-sm font-medium mb-1">
                            #{court.courtID} -{" "}
                            {court.available
                              ? t
                                ? t("courtsList.available")
                                : "Available"
                              : t
                              ? t("courtsList.taken")
                              : "Taken"}
                          </h4>

                          {statusClass === "likely-available" && (
                            <p className="text-xs text-gray-600">
                              {t
                                ? t("courtsList.lastTaken.likelyAvailable1")
                                : "Last taken about"}{" "}
                              {timeSinceOccupied}{" "}
                              {t
                                ? t("courtsList.lastTaken.likelyAvailable2")
                                : "minutes ago."}
                            </p>
                          )}

                          {statusClass === "taken" && (
                            <p className="text-xs text-gray-600">
                              {t
                                ? t("courtsList.lastTaken.taken1")
                                : "Taken for"}{" "}
                              {timeSinceOccupied}{" "}
                              {t
                                ? t("courtsList.lastTaken.taken2")
                                : "minutes."}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </Grid>
    </div>
  );
};

export default Court;
