// court.types.ts
export interface CourtType {
  available: boolean;
  name: string;
  occupiedUntil: string;
  surface: string;
  lights: boolean;
  courtID: string;
}

export interface CourtLocation{
  courts: CourtType[];
  googleMapsLink: string;
  locationID: string;
  address: string;
  coordinates: [number, number]; // Latitude, Longitude
  courtName: string;
}

export type CourtsType = CourtLocation[];