import React from "react";
import Dashboard from "./Pages/Dashboard";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Suggestion from "./Pages/Suggestion";
import Login from "./Pages/Login";
import Timetable from "./Pages/Timetable";
import Signup from "./Pages/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Courses from "./Pages/Courses";
import AddCourses from "./Components/course/AddCourses";

import Calendar from "./Pages/Calendar";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/suggestion" element={<Suggestion />} />
          <Route path="courses/addcourses" element={<AddCourses />} />

          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
