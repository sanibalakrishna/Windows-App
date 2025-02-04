import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import { Toaster } from "react-hot-toast";
import AppPage from "./pages/Application";
import VLCController from "./pages/VLCController";

const App = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/:id" element={<AppPage />} />
          <Route path="/videoplayer" element={<VLCController />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
