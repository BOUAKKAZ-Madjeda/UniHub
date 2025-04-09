import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudyResources from "./components/study-resources";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudyResources />} />
        <Route path="/:section" element={<StudyResources />} />
        <Route path="/:section/:year" element={<StudyResources />} />
        <Route path="/:section/:year/:semester" element={<StudyResources />} />
        <Route path="/:section/:year/:semester/:subject" element={<StudyResources />} />
        <Route path="/:section/:year/:semester/:subject/:folder" element={<StudyResources />} />
      </Routes>
    </Router>
  );
}