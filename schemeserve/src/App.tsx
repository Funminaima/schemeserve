import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search />} />
        {/* <Route path="/crimeDataView/:params" element={<CrimeDataView/>}/> */}
      </Routes>

      {/* <Search/> */}
    </Router>
  );
}

export default App;
