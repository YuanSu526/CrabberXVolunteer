import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './components/login/login';
import VolunteerDashboard from './components/volunteer/dashboard/dashboard';
import VolunteerCalendar from './components/volunteer/calendar/calendar';
import VolunteerDataUpload from './components/volunteer/upload/upload';

import SupervisorDashboard from './components/supervisor/dashboard/dashboard';
import SupervisorCalendar from './components/supervisor/calendar/calendar';

import GeneralInsight from './components/public/general-insight/general-insight'
import CrabInsight from './components/public/crab-insight/crab-insight';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Possible routes for volunteer components */}
        {<Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />}
        {<Route path="/volunteer/calendar" element={<VolunteerCalendar />} /> }
        {<Route path="/volunteer/dataUpload" element={<VolunteerDataUpload />} />}

        {/* Routes for supervisor components */}
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        <Route path="/supervisor/calendar" element={<SupervisorCalendar />} />

        {/* Routes for public components */}
        <Route path="/public/general-insight" element={<GeneralInsight />} />
        <Route path="/public/crab-insight" element={<CrabInsight />} />

      </Routes>
    </Router>
  );
}

export default App;
