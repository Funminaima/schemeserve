import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import marker from "leaflet/dist/images/marker-icon.png";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { CrimeObject, TransformedCrime } from "../../type.d";

L.Icon.Default.imagePath = ".";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,
});

interface Crime {
  id: number;
  category: string;
  location?: {
    latitude: number;
    longitude: number;
    street: {
      name: string;
    };
  };
  outcome_status?: {
    category: string;
    date: string;
  };
  month: string;
}

interface CrimeMapProps {
  crimeData: CrimeObject[];

  iterateAndTransform: (crimeData: CrimeObject[]) => TransformedCrime[];
  filteredCrimeData: CrimeObject[];

  selectedCrimeType: string;
}

const MapDisplay: React.FC<CrimeMapProps> = ({
  crimeData,
  filteredCrimeData,
  iterateAndTransform,
  selectedCrimeType,
}) => {
  const data = selectedCrimeType === "" ? crimeData : filteredCrimeData;
  const mapData: TransformedCrime[] = iterateAndTransform(data);
  const firstCrime: any = mapData ? mapData[0] : [];
  const initialCenter: [number, number] = [
    firstCrime?.Latitude,
    firstCrime?.Longitude,
  ];
  const tileLayerProps = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  };
  const mapContainerProps = {
    center: mapData.length > 0 ? firstCrime : [51.505, -0.09],
    zoom: 6,
    style: { height: "600px", width: "100%" }, // Map container style
  };

  return (
    <MapContainer {...mapContainerProps}>
      <TileLayer {...tileLayerProps} />
      {mapData.length > 0 &&
        mapData.map((crime: any) => (
          <Marker key={crime.key} position={[crime.Latitude, crime.Longitude]}>
            <Popup>
              <div>
                <p>Postcode: {crime.Postcode}</p>
                <p>Category: {crime.Category}</p>
                <p>Date: {crime["Date of crime"]}</p>
                <p>Outcome Status: {crime["Outcome status"] || "On Going"}</p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>

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

export default MapDisplay;
