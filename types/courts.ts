// court.types.ts
export interface Court {
  available: boolean;
  name: string;
  occupiedUntil: string;
  surface: string;
  lights: boolean;
  courtID: string;
}

export interface CourtLocation {
  courts: Court[];
  googleMapsLink: string;
  locationID: string;
  address: string;
  coordinates: [number, number]; // Latitude, Longitude
  courtName: string;
}

export type CourtsType = CourtLocation[];