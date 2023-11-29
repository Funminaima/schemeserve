import { CrimeObject, TransformedCrime } from "../type.d";
import { getPostcode } from "../api/apiCall";

export const iterateAndTransform = (
  crimeData: CrimeObject[]
): TransformedCrime[] => {
  const result: TransformedCrime[] = [];

  for (const crimeObject of crimeData) {
    for (const [postcode, crimeArray] of Object.entries(crimeObject)) {
      for (const crime of crimeArray) {
        const transformedCrime: TransformedCrime = {
          key: `${Math.random().toString(36).substr(2, 32)}`,
          Postcode: postcode,
          "Date of crime": crime.month,
          "Approximate street address":
            crime.location && crime.location.street
              ? crime.location.street.name
              : "N/A",
          "Outcome status": crime.outcome_status?.category || "On Going",
          Latitude: crime.location.latitude,
          Longitude: crime.location.longitude,
          Category: crime.category,
        };

        result.push(transformedCrime);
      }
    }
  }
  return result;
};

export const isValidPostcode = async (postcode: string): Promise<boolean> => {
  const response = await getPostcode(postcode);
  return (
    !response.error &&
    response.data.latitude !== undefined &&
    response.data.longitude !== undefined
  );
};
