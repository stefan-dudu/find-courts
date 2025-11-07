import React from "react";
import CheckInClient from "@/components/CheckInClient";

export default async function CourtCheckIn({
  params,
}: {
  params: Promise<{ courtID: string }>;
}) {
  const { courtID } = await params;

  // server-side fetch of courts (keep server rendering & avoid client re-fetch)
  const response = await fetch(
    process.env.NEXT_PUBLIC_COURT_GET_LINK || "",
    { next: { revalidate: 60 } } // optional ISR ttl
  );
  const data = await response.json();

  // find the court by id (preserve original filtering logic)
  const filtered = (data?.body || [])
    .map((location: any) => ({
      ...location,
      courts: location.courts.filter(
        (c: any) => String(c.courtID) === String(courtID)
      ),
    }))
    .filter((l: any) => l.courts.length > 0);

  const location = filtered[0] ?? null;
  const court = location?.courts?.[0] ?? null;
//   console.log("location", location)


  // If no court found, you can return a 404 or a friendly message
  if (!court) {
    return <div className="p-8 text-center">Court {courtID} not found.</div>;
  }

  // Render client component and pass server-fetched data as props
  return (
    <div className="p-6">
      {/* CheckInClient is a client component that handles geolocation, auth and check-in */}
      {/* @ts-ignore Server -> Client prop passing (court contains plain JSON) */}
      <CheckInClient court={court} location={location} courtID={courtID} />
    </div>
  );
}