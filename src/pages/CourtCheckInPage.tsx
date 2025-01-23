import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CourtLocation } from "../types/courts";

type Props = {};

const CourtCheckInPage = (props: Props) => {
  const [court, setCourt] = useState<CourtLocation>();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false); // Track check-in status
  const navigate = useNavigate();
  const auth = useAuth();
  let { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCourts();
    getCoordinates();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const fetchCourts = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_COURT_GET_LINK || "");
      const data = await response.json();

      const filteredCourt = data.body
        .map((location: any) => ({
          ...location,
          courts: location.courts.filter((court: any) => court.courtID === id),
        }))
        .filter((el: any) => el.courts.length > 0);
      setCourt(filteredCourt[0]?.courts[0] || null);
    } catch (error) {
      console.error("Error fetching courts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCoordinates = () => {
    if (!navigator.geolocation) {
      setError(`${t("checkInPage.locationError")}`);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setError(null);
      },
      (err) => {
        setError(`${t("checkInPage.errorGettingLocation")} ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCheckIn = async (courtID: string) => {
    if (!auth.isAuthenticated) {
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
        setAlertMessage(`${t("checkInPage.success")}`);
        setAlertSeverity("success");
        setOpenSnackbar(true);

        // Mark the court as checked in
        setCheckedIn(true);

        // Redirect to home after a delay
        setTimeout(() => navigate("/"), 3000);
      } else {
        const errorData = await response.json();
        setAlertMessage(`Error: ${errorData.message}`);
        setAlertSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error checking in:", error);
      setAlertMessage(`${t("checkInPage.error")}`);
      setAlertSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const isWithinRadius = (
    userLat: number,
    userLon: number,
    courtLat: number,
    courtLon: number,
    radius: number
  ) => {
    const haversineDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => {
      const toRadians = (deg: number) => (deg * Math.PI) / 180;
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) ** 2;

      return 2 * 6371000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    return haversineDistance(userLat, userLon, courtLat, courtLon) <= radius;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <p>{t("loading.courtInfo")}</p>
      </div>
    );
  }

  return (
    <div>
      {!checkedIn ? (
        isWithinRadius(
          coordinates?.lat || 0,
          coordinates?.lng || 0,
          court?.lat || 0,
          court?.lon || 0,
          50
        ) ? (
          court?.available ? (
            <div>
              <h2>
                {t("checkInPage.informCourtNo")} {id}
              </h2>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleCheckIn(id!)}
              >
                Check in
              </Button>
            </div>
          ) : (
            <h2>{t("checkInPage.courtTaken")}</h2>
          )
        ) : (
          <h2>{t("checkInPage.distanceError")}</h2>
        )
      ) : (
        <h2>{t("checkInPage.confirmationAndRedirect")}</h2>
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
    </div>
  );
};

export default CourtCheckInPage;
