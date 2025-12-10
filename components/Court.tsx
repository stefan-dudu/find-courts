// components/Court.tsx
"use client";
import { CourtLocation, CourtType } from "@/types/courts";
import React, { useState } from "react";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";

const Court = ({ data }: { data: CourtLocation[] }) => {
  let locations = data || [];
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const { t } = useTranslation();

  const toggleLocation = (locationID: string) => {
    setExpandedLocation((prev) => (prev === locationID ? null : locationID));
  };

  const getCourtStatusClass = (court: CourtType) => {
    // parse occupiedUntil safely
    const occupiedUntilStr = court.occupiedUntil || new Date().toISOString();
    const occupiedUntil = new Date(occupiedUntilStr);
    const occupiedSince = new Date(occupiedUntil);
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
    <div>
      <div className="relative isolate px-6 pt-10 lg:px-8 ">
        <div className="mx-auto max-w-2xl py-10 sm:py-10 lg:py-6">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
              {t("hero.title")}
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
              {t("hero.subTitle")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/about"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
              >
                Afla mai multe
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-row flex-wrap">
        <Grid container spacing={2} className="justify-center">
          {locations.map((location: CourtLocation) => {
            const availableCourts = location.courts.filter(
              (court: CourtType) =>
                court.available &&
                (new Date().getTime() -
                  new Date(court.occupiedUntil).getTime()) /
                  3600000 >
                  1
            ).length;

            const likelyAvailableCourts = location.courts.filter(
              (court: CourtType) =>
                court.available &&
                (new Date().getTime() -
                  new Date(court.occupiedUntil).getTime()) /
                  3600000 >
                  0.1 &&
                (new Date().getTime() -
                  new Date(court.occupiedUntil).getTime()) /
                  3600000 <
                  1
            ).length;

            const takenCourts = location.courts.filter(
              (court: CourtType) => !court.available
            ).length;

            return (
              <Grid key={location.locationID}>
                <div
                  key={location.locationID}
                  className="w-[320px] sm:w-[420px] bg-white dark:bg-gray-800 rounded-xl p-5 m-5 shadow-2xl text-center"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left flex flex-col items-start items-center justify-between gap-4">
                      <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
                        {location.courtName}
                      </h3>
                      {location.googleMapsLink && (
                        <div className="hidden sm:flex sm:justify-center">
                          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 dark:ring-gray-200/10 dark:hover:ring-gray-200/20 ring-gray-900/10 hover:ring-gray-900/20">
                            <a
                              href={location.googleMapsLink}
                              className="text-indigo-500 text-sm/8 dark:text-indigo-300"
                              target="_blank"
                            >
                              {t ? t("courtsList.viewOnMaps") : "View on Maps"}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-col items-end gap-1">
                        {availableCourts > 0 && (
                          <span className="text-green-600 dark:text-green-500 font-semibold text-sm">
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

                      <button
                        onClick={() => toggleLocation(location.locationID)}
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
                    </div>
                  </div>

                  {/* Animated expand/collapse wrapper (always rendered) */}
                  <div
                    // Tailwind: transition on max-height and opacity; arbitrary max-h value for expanded state
                    className={`overflow-hidden transition-all duration-700 ease-in-out  ${
                      expandedLocation === location.locationID
                        ? "max-h-[1000px] opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="grid gap-3 py-2">
                      {location.courts.map((court: CourtType) => {
                        const statusClass = getCourtStatusClass(court);
                        const occupiedUntil = new Date(
                          court.occupiedUntil || new Date().toISOString()
                        );
                        const occupiedSince = new Date(occupiedUntil);
                        occupiedSince.setHours(occupiedSince.getHours() - 1);
                        const timeSinceOccupied = Math.round(
                          (new Date().getTime() - occupiedSince.getTime()) /
                            60000
                        );

                        const statusStyles =
                          statusClass === "available"
                            ? "bg-green-800 border-l-4 border-green-500"
                            : statusClass === "likely-available"
                            ? "bg-amber-800 border-l-4 border-amber-500"
                            : "bg-rose-800 border-l-4 border-rose-500";

                        return (
                          <div
                            key={court.courtID}
                            className={`flex items-start p-3 rounded-md ${statusStyles}`}
                          >
                            <div className="text-left">
                              <h4 className="text-sm font-medium mb-1 text-gray-100">
                                #{court.courtID} -{" "}
                                {court.available
                                  ? t
                                    ? t("courtsList.available")
                                    : "Disponibil"
                                  : t
                                  ? t("courtsList.taken")
                                  : "Ocupat"}
                              </h4>

                              {statusClass === "likely-available" && (
                                <p className="text-xs text-gray-200">
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
                                <p className="text-xs text-gray-200">
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
                  </div>
                  {/* End animated wrapper */}
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default Court;
