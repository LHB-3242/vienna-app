import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StateSecurity from "./pages/StateSecurity";
import StateProtocols from "./pages/StateProtocols";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/state-security-laws" element={<StateSecurity />} />
          <Route path="/state-security-protocols" element={<StateProtocols />} />
          <Route path="/admin-vienna-rp" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;