import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { Button } from "antd";

import { getPostcode, getCrimeDataPerPostcode } from "../api/apiCall";
import { CrimeObject, Crime, TransformedCrime, NestedObject } from "../type.d";
import SearchBar from "../components/SearchBar";
import CrimeDataTable from "../components/CrimeDataTable";
import { isValidPostcode } from "../helper";

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
  const [view, setView] = useState(true);
  const [storedPostCodes, setStoredPostCodes] = useState<string[]>([]);
  const [selectedCrimeType, setSelectedCrimeType] = useState<string>("");
  const [historicPostCode, setHistoricPostCode] = useState<any>([]);
  const [filteredCrimeData, setFilteredCrimeData] = useState<CrimeObject[]>([]);

  useEffect(() => {
    if (initialPostcodes) {
      fetchData(historicPostCode);
      SetError("");
    }

    const storedPostCodeLocal = localStorage.getItem("searchedPostCodes");
    if (storedPostCodeLocal) {
      storedPostCode(JSON.parse(storedPostCodeLocal));
      fetchData(JSON.parse(storedPostCodeLocal));
      SetError("");
    }

    return () => {};
  }, []);

  const storedPostCode = (postCodes: []) => {
    setHistoricPostCode(postCodes);
  };

  const getSingleData = async (selectedPostCodes: string[]) => {
    const result: CrimeObject[] = [];

    try {
      setLoading(true);

      const postcodeString = selectedPostCodes[selectedPostCodes.length - 1];
      const response = await getPostcode(postcodeString);

      if (response.error) {
        SetError(response.error);
      } else {
        SetError("");
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
      SetError("");
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
            SetError("");
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
    if (postcode.includes(",")) {
      getMultipleData(selectedPostCode);
    } else {
      getSingleData(selectedPostCode);
    }
  };

  const handleSearch = async (value?: string) => {
    const splitValue = value?.split(" ").join("").split(",");
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
    const isValidPostcodes = await Promise.all(
      nonEmptyPostcodes.map(isValidPostcode)
    );
    if (!isValidPostcodes[isValidPostcode.length - 1]) {
      SetError("Invalid postcode detected");
    } else {
      SetError("");
    }

    if (
      nonEmptyPostcodes.length > 0 &&
      isValidPostcodes[isValidPostcodes.length - 1] === true
    ) {
      // const newQueryString = nonEmptyPostcodes.join("&");
      const newQuery = nonEmptyPostcodes.filter(
        (_, index) => isValidPostcodes[index]
      );

      const newQueryString = newQuery.join("&");
      // historicPostCode.forEach((postcode:any) => queryParams.append('postcode', postcode));
      window.history.pushState({}, "", `/?postcodes=${newQueryString}`);
      fetchData(newQuery);
      SetError("");
    }
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value);
    setLoading(false);
    SetError("");
  };
  const handlePostCodeClick = async (
    selectedPostcode: string,
    value: string
  ) => {
    try {
      setLoading(true);
      setPostcode(selectedPostcode);
      fetchData([selectedPostcode]);

      window.history.pushState({}, "", `/?postcodes=${selectedPostcode}`);
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
    const newQueryString = updatedPostCodes.join("&");
    window.history.pushState({}, "", `/?postcodes=${newQueryString}`);
    localStorage.setItem("searchedPostCodes", JSON.stringify(updatedPostCodes));
  };

  const filteredCrimeDataFn = (
    // icrimeData: NestedObject[],
    crimeType: string
  ) => {
    const filteredCrimeData: CrimeObject[] = crimeData
      .map((obj: CrimeObject) => {
        const filteredNestedArray = Object.entries(obj).reduce(
          (acc: any, [key, nestedArray]: any) => {
            const filteredArray = nestedArray.filter(
              (item: Crime) => item.category === crimeType
            );
            if (filteredArray.length > 0) {
              acc[key] = filteredArray;
            }
            return acc;
          },
          {}
        );
        return Object.keys(filteredNestedArray).length > 0
          ? filteredNestedArray
          : null;
      })
      .filter(Boolean);
    setFilteredCrimeData(filteredCrimeData);
  };

  const convertToSingleArray = () => {
    if (crimeData.length > 0) {
      const combinedArray = crimeData.flatMap(
        (obj: any) => Object.values(obj)[0]
      );
      return combinedArray;
    } else {
      return [];
    }
  };
  convertToSingleArray();
  const crimeTypes: string[] = convertToSingleArray()
    ? Array.from(
        new Set(convertToSingleArray().map((crime: any) => crime.category))
      )
    : [];

  const onChangeCrimeTypes = (value: string) => {
    setSelectedCrimeType(value);
    filteredCrimeDataFn(value);
  };

  const clickButtonView = () => {
    setView(!view);
  };
  return (
    <div className="layout">
      <div className="title">
        <h2>Get Crime Data based on post code</h2>
      </div>
      {Error && <div className="error-message">{Error}</div>}
      <SearchBar
        handleSearch={handleSearch}
        handleChange={handlechange}
        postCode={postcode}
        handlePostCodeClick={handlePostCodeClick}
        handleRemovePostCode={handleRemovePostCode}
        historicPostCode={historicPostCode}
        crimeDataPerPostCode={crimeDataPerPostCode}
      />

      <div>
        <CrimeDataTable
          clickButtonView={clickButtonView}
          view={view}
          crimeTypes={crimeTypes}
          filteredCrimeData={filteredCrimeData}
          onChangeCrimeTypes={onChangeCrimeTypes}
          crimeDataPerPostCode={crimeDataPerPostCode}
          selectedCrimeType={selectedCrimeType}
          crimeData={crimeData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Search;
