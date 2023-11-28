import axios from "axios";
import { Crime } from "../type.d";

export const getPostcode = async (postcode: string) => {
  try {
    const response = await axios.get(
      `http://api.getthedata.com/postcode/${postcode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching postcodes:", error);
    return [];
  }
};

export const getCrimeDataPerPostcode = async (
  lat: string,
  lng: string
): Promise<Crime[]> => {
  try {
    const response = await axios.get(
      `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching crime data:`, error);
    return [];
  }
};
