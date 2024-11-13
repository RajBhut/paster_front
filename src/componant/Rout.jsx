import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loginc from "./Loginc";

export default function Rout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginc />} />
      </Routes>
    </BrowserRouter>
  );
}
