import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "antd";

import marker from "leaflet/dist/images/marker-icon.png";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { CrimeObject, TransformedCrime } from "../../type.d";
import { iterateAndTransform } from "../../helper";

L.Icon.Default.imagePath = ".";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,
});
const Map = () => {
  const { state } = useLocation();
  const storedPostCodes = localStorage.getItem("searchedPostCodes");
  const filteredCrimeData = state && state.stateObject.filteredCrimeData;
  const selectedCrimeType = state && state.stateObject.selectedCrimeType;
  const crimeData = state && state.stateObject.crimeData;

  const data = selectedCrimeType === "" ? crimeData : filteredCrimeData;
  const mapData: TransformedCrime[] = iterateAndTransform(data);
  const firstCrime: any = mapData.length > 0 ? mapData[0] : null;

  const isValidLatitude = typeof firstCrime?.Latitude === "number";
  const isValidLongitude = typeof firstCrime?.Longitude === "number";

  const initialCenter: [number, number] =
    isValidLatitude && isValidLongitude
      ? [firstCrime.Latitude, firstCrime.Longitude]
      : [51.505, -0.09];

  const tileLayerProps = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  };
  const mapContainerProps = {
    center: initialCenter,
    zoom: 8,
    style: { height: "100vh", width: "100%" },
  };

  return (
    <Card className="map">
      <div className="map-title">
        <h2>Map view of crime Data</h2>
        <Link
          to={`/?postcodes=${
            storedPostCodes !== null
              ? JSON.parse(storedPostCodes).join("&")
              : ""
          }`}
        >
          Back to Table view
        </Link>
      </div>

      <MapContainer {...mapContainerProps}>
        <TileLayer {...tileLayerProps} />
        {mapData.length > 0 &&
          mapData.map((crime: any) => (
            <Marker
              key={crime.key}
              position={[crime.Latitude, crime.Longitude]}
            >
              <Tooltip>
                <Card>
                  <p>Postcode: {crime.Postcode.toUpperCase()}</p>
                  <p>Category: {crime.Category.toUpperCase()}</p>
                  <p>Date: {crime["Date of crime"].toUpperCase()}</p>
                  <p>
                    Outcome Status:{" "}
                    {crime["Outcome status"].toUpperCase() || "On Going"}
                  </p>
                </Card>
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>
    </Card>
    //     <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    //   <TileLayer
    //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //   />
    //   <Marker position={[51.505, -0.09]}>
    //     <Popup>
    //       A pretty CSS3 popup. <br /> Easily customizable.
    //     </Popup>
    //   </Marker>
    //   <h2>hello</h2>
    // </MapContainer>
  );
};

export default Map;
