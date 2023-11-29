import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Search from "./pages/Search";
import Map from "./components/Map/Map";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/map" element={<Map />} />
      </Routes>

      {/* <Search/> */}
    </Router>
  );
}

export default App;
