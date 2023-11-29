import React from "react";
import { Select, Table, Button, Skeleton } from "antd";
import { Link } from "react-router-dom";

import { Crime, CrimeObject, TransformedCrime } from "../type.d";
import { iterateAndTransform } from "../helper";

interface Props {
  crimeTypes: string[];
  filteredCrimeData: CrimeObject[];
  onChangeCrimeTypes: (value: string) => void;
  crimeDataPerPostCode: Crime | {};
  selectedCrimeType: string;
  crimeData: CrimeObject[];
  loading: boolean;
  clickButtonView: () => void;
  view: boolean;
}

const { Option } = Select;

const columns = [
  {
    title: "Postcode",
    dataIndex: "Postcode",
    key: "Postcode",
  },
  {
    title: "Date of crime",
    dataIndex: "Date of crime",
    key: "Date of crime",
  },
  {
    title: "Approximate street address",
    dataIndex: "Approximate street address",
    key: "Approximate street address",
  },
  {
    title: "Outcome status",
    dataIndex: "Outcome status",
    key: "Outcome status",
  },
];

const CrimeDataTable = ({
  crimeTypes,
  filteredCrimeData,
  onChangeCrimeTypes,
  selectedCrimeType,
  crimeData,
  loading,
  clickButtonView,
  view,
}: Props) => {
  const storedPostCodes = localStorage.getItem("searchedPostCodes");

  const data = selectedCrimeType === "" ? crimeData : filteredCrimeData;
  const transformedData = iterateAndTransform(data);

  const stateObject = {
    filteredCrimeData,
    crimeData,
    // iterateAndTransform,
    selectedCrimeType,
  };
  return (
    <div className="TableDisplay">
      {loading ? (
        <Skeleton />
      ) : (
        <div className="crime-display">
          <h2>Crime Data Display</h2>
          <div className="d-flex">
            <div>
              <strong>Crime Types:</strong>
              <Select
                value={selectedCrimeType}
                onChange={onChangeCrimeTypes}
                style={{ width: 400 }}
                size={"large"}
              >
                <Option value="">All</Option>
                {crimeTypes.map((type: string, id: number) => (
                  <Option key={id} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Link
                to={`/map?postcodes=${
                  storedPostCodes !== null
                    ? JSON.parse(storedPostCodes).join("&")
                    : ""
                }`}
                state={{ stateObject }}
              >
                <Button type="primary" size="large" onClick={clickButtonView}>
                  {view ? "Map View" : "Table View"}
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <h3>
              {selectedCrimeType === ""
                ? "All Crimes"
                : `${
                    selectedCrimeType.charAt(0).toUpperCase() +
                    selectedCrimeType.slice(1)
                  } Crimes`}
            </h3>
            <Table
              dataSource={transformedData}
              columns={columns}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrimeDataTable;
