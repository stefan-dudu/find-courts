"use client";

import React, { useEffect, useState } from "react";
import { CourtLocation, CourtType } from "@/types/courts";
// import { useAuth } from "react-oidc-context"; // auth disabled for now
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  court: CourtType;
  location?: CourtLocation | null;
  courtID: string;
};

export default function CheckInClient({ court, location, courtID }: Props) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  // auth disabled for now
  // const auth = useAuth();
  const auth = null;

  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    getCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getCoordinates = () => {
    // console.log("Does this wokr? - getCoordinates");
    if (!navigator?.geolocation) {
      setError(
        t ? t("checkInPage.locationError") : "Geolocation not supported"
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setError(null);
      },
      (err) => {
        setError(
          t
            ? `${t("checkInPage.errorGettingLocation")} ${err.message}`
            : `Error getting location: ${err.message}`
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const isWithinRadius = (
    userLat: number,
    userLon: number,
    courtLat: number,
    courtLon: number,
    radius: number
  ) => {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRadians(courtLat - userLat);
    const dLon = toRadians(courtLon - userLon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(userLat)) *
        Math.cos(toRadians(courtLat)) *
        Math.sin(dLon / 2) ** 2;
    const distance = 2 * 6371000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log(distance, radius);
    return distance <= radius;
  };

  const handleCheckIn = async (id: string | number) => {
    // auth flow temporarily disabled
    // if (!auth.isAuthenticated) {
    //   auth.signinRedirect();
    //   return;
    // }

    // const token = auth.user?.id_token;
    const token = undefined; // no auth for now
    setLoading(true);

    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_COURT_CHECKIN_LINK}?courtID=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // disabled for now
          },
        }
      );

      if (resp.ok) {
        setAlertMessage(
          t ? t("checkInPage.success") : "Checked in successfully"
        );
        setAlertSeverity("success");
        setOpenSnackbar(true);
        setCheckedIn(true);

        // redirect after a short delay
        setTimeout(() => router.push("/"), 2000);
      } else {
        const errData = await resp.json().catch(() => ({}));
        setAlertMessage(
          errData?.message
            ? `Error: ${errData.message}`
            : t
            ? t("checkInPage.error")
            : "Check-in failed"
        );
        setAlertSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Check-in error:", err);
      setAlertMessage(t ? t("checkInPage.error") : "Error checking in");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  if (!coordinates) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <CircularProgress />
        <div className="text-sm text-gray-600">
          {error ??
            (t
              ? t("checkInPage.waitingForLocation")
              : "Waiting for location...")}
        </div>
      </div>
    );
  }

  const withinRadius = isWithinRadius(
    coordinates.lat,
    coordinates.lng,
    Number(location?.coordinates[0] || 0),
    Number(location?.coordinates[1] || 0),
    100
  );

  //   console.log(coordinates);

  return (
    <div className="max-w-xl mx-auto p-4">
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
      {!checkedIn ? (
        withinRadius ? (
          court?.available ? (
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-lg font-semibold text-gray-50">
                {t ? t("checkInPage.informCourtNo") : "Checking in to court"}{" "}
                {courtID}
              </h2>

              <div className="flex gap-3">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleCheckIn(courtID)}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : t ? (
                    t("checkInPage.checkInButton")
                  ) : (
                    "Check in"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <h2 className="text-center">
              {t
                ? t("checkInPage.courtTaken")
                : "This court is currently taken."}
            </h2>
          )
        ) : (
          <h2 className="text-center">
            {t
              ? t("checkInPage.distanceError")
              : "You are too far from the court to check in."}
          </h2>
        )
      ) : (
        <h2 className="text-center">
          {t
            ? t("checkInPage.confirmationAndRedirect")
            : "Checked in — redirecting home..."}
        </h2>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
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
}
