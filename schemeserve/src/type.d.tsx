export interface Crime {
  category: string;
  context: string;
  id: number;
  location: {
    latitude: string;
    longitude: string;
    street: {
      id: number;
      name: string;
    };
  };
  location_subtype: string;
  location_type: string;
  month: string;
  outcome_status: null | {
    category: string;
    date: string;
  };
  persistent_id: string;
}

export interface CrimeObject {
  [postcode: string]: Crime[];
}

export interface TransformedCrime {
  key: string;
  Postcode: string;
  Category: string;
  // 'Context': string;
  // 'ID': number;
  Latitude: string;
  Longitude: string;
  // 'Street ID': number;
  "Approximate street address": string;
  // 'Location Subtype': string;
  // 'Location Type': string;
  "Date of crime": string;
  "Outcome status": string | null;
  // 'Outcome Date': string | null;
  // 'Persistent ID': string;
}
interface NestedItem {
  [key: string]: string;
}

export interface NestedObject {
  [key: string]: NestedItem[];
}
