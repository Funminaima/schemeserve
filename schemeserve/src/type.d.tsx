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
