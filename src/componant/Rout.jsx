import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loginc from "./Loginc";
import Home from "./Home";

export default function Rout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginc />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
