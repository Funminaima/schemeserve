import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { getPostcode, getCrimeDataPerPostcode } from "../api/apiCall";
import { CrimeObject, Crime } from "../type.d";
import SearchBar from "../components/SearchBar";

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initial_Postcodes = queryParams.get("postcodes") || "";
  const initialPostcodes: string = initial_Postcodes.replace(/%20/g, "");
  const [postcode, setPostcode] = useState<string>("");

  const [crimeData, setCrimeData] = useState<CrimeObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [Error, SetError] = useState<string>("");
  const [crimeDataPerPostCode, setCrimeDataPerPostCode] = useState<Crime | {}>(
    {}
  );

  const [storedPostCodes, setStoredPostCodes] = useState<string[]>([]);
  const [selectedCrimeType, setSelectedCrimeType] = useState<string>("");
  const [historicPostCode, setHistoricPostCode] = useState<any>(
    decodeURIComponent(initialPostcodes)
      .split("&")
      .filter((post: any) => post !== "")
  );
  const [filteredCrimeData, setFilteredCrimeData] = useState<CrimeObject[]>([]);
  useEffect(() => {
    if (initialPostcodes) {
      fetchData(historicPostCode);
      console.log("me inside useEffect 1");
    }
    const storedPostCodes = localStorage.getItem("searchedPostCodes");
    if (storedPostCodes) {
      setStoredPostCodes(JSON.parse(storedPostCodes));
    }

    return () => {};
  }, []);

  const getSingleData = async (selectedPostCodes: string[]) => {
    const result: CrimeObject[] = [];

    try {
      setLoading(true);

      const postcodeString = selectedPostCodes[selectedPostCodes.length - 1];
      const response = await getPostcode(postcodeString);

      if (response.error) {
        SetError(response.error);
      } else {
        setCrimeDataPerPostCode(response.data);

        const crimeResponse = await getCrimeDataPerPostcode(
          response.data.latitude,
          response.data.longitude
        );

        result.push({ [postcodeString]: crimeResponse });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      SetError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }

    setCrimeData(result);
  };

  const getMultipleData = async (selectedPostCodes: any): Promise<void> => {
    const results: CrimeObject[] = [];

    try {
      await Promise.all(
        selectedPostCodes.map(async (postcode: any) => {
          setLoading(true);

          const response = await getPostcode(postcode);

          if (response.error) {
            console.error("Error fetching postcodes:", response.error);
          } else {
            const crimeResponse = await getCrimeDataPerPostcode(
              response.data.latitude,
              response.data.longitude
            );

            if (crimeResponse.length > 0) {
              setLoading(false);
              results.push({ [postcode]: crimeResponse });
            }
          }

          await new Promise((resolve) => setTimeout(resolve, 2000));
        })
      );

      const combinedArray = results.flat();
      // const combinedArray = [].concat(...results);
      setCrimeData(combinedArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      SetError("An error occurred while fetching data.");
    }
  };

  const fetchData = async (selectedPostCode: string[]) => {
    console.log(selectedPostCode, "selected post code fetch data");
    if (postcode.includes(",")) {
      getMultipleData(selectedPostCode);
    } else {
      getSingleData(selectedPostCode);
    }
    console.log(selectedPostCode, "selectedPostCode");
  };

  const handleSearch = async (value?: string) => {
    const splitValue = value?.trim().split(",");

    const uniqueHistoricPostCode = Array.from(
      new Set<string>([...historicPostCode, splitValue].flat())
    );
    // Filter out empty postcodes
    const nonEmptyPostcodes = uniqueHistoricPostCode.filter(
      (postcode: any) => postcode.trim() !== ""
    );
    setHistoricPostCode(nonEmptyPostcodes);

    localStorage.setItem(
      "searchedPostCodes",
      JSON.stringify(nonEmptyPostcodes)
    );

    // Update the query string only if there are non-empty postcodes
    if (nonEmptyPostcodes.length > 0) {
      const newQueryString = nonEmptyPostcodes.join("&");
      // historicPostCode.forEach((postcode:any) => queryParams.append('postcode', postcode));
      window.history.pushState({}, "", `/?postcodes=${newQueryString}`);
      fetchData(nonEmptyPostcodes);
    }

    console.log(nonEmptyPostcodes, "nonEmptyPostcode nonEmptyPostcode");
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value.trim());
    console.log(e.target.value, "target");
    setLoading(false);
  };
  const handlePostCodeClick = async (
    selectedPostcode: string,
    crimeDataPerPostCode: Crime
  ) => {
    try {
      setLoading(true);
      fetchData([selectedPostcode]);

      const response = await axios.get(
        `https://data.police.uk/api/crimes-street/all-crime?lat=${crimeDataPerPostCode}&lng=${crimeDataPerPostCode}`
      );
      setCrimeData(response.data);

      const newQueryString = historicPostCode.join(",");
      window.history.pushState({}, "", `/?postcodes=${newQueryString}`);
    } catch (error) {
      console.error("Error fetching crime data for selected postcode:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePostCode = (removedPostCode: string) => {
    const updatedPostCodes = historicPostCode.filter(
      (postcode: any) => postcode !== removedPostCode
    );
    setHistoricPostCode(updatedPostCodes);
    const newQueryString = updatedPostCodes.join(",");
    window.history.pushState({}, "", `/?postcodes=${newQueryString}`);
    localStorage.setItem("searchedPostCodes", JSON.stringify(updatedPostCodes));

    setCrimeData([]);
  };
  return (
    <div>
      <SearchBar
        handleSearch={handleSearch}
        handleChange={handlechange}
        postCode={postcode}
        handlePostCodeClick={handlePostCodeClick}
        handleRemovePostCode={handleRemovePostCode}
        historicPostCode={historicPostCode}
        crimeDataPerPostCode={crimeDataPerPostCode}
      />
    </div>
  );
};

export default Search;
