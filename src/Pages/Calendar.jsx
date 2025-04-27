import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
  FaBell,
} from "react-icons/fa";
import { differenceInDays, isAfter, isBefore } from "date-fns";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CourseCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    fetch("https://academic-planner-backend.onrender.com/courses/myCourses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        const evts = data
          .filter((c) => c.deadline)
          .map((c) => ({
            title: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                }}
              >
                {c.status ? (
                  <FaCheckCircle
                    color="#16a34a"
                    style={{
                      minWidth: "14px",
                      minHeight: "14px",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <FaExclamationCircle
                    color="#dc2626"
                    style={{
                      minWidth: "14px",
                      minHeight: "14px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    wordBreak: "break-word",
                    textAlign: "center",
                  }}
                >
                  {c.subjectName}
                </span>
              </div>
            ),
            start: new Date(c.deadline),
            end: new Date(c.deadline),
            allDay: true,
            status: c.status,
            courseData: c, // Store the original course data
          }));

        setEvents(evts);
        checkUpcomingDeadlines(evts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  // Check for upcoming deadlines and show notification
  const checkUpcomingDeadlines = (events) => {
    const now = new Date();
    const upcoming = events
      .filter(
        (event) =>
          !event.status && // Only upcoming (not completed)
          isAfter(new Date(event.start), now) && // Deadline is in the future
          differenceInDays(new Date(event.start), now) <= 7 // Within 7 days
      )
      .map((event) => ({
        name: event.courseData.subjectName,
        date: format(new Date(event.start), "MMM dd, yyyy"),
        daysLeft: differenceInDays(new Date(event.start), now),
      }));

    if (upcoming.length > 0) {
      setUpcomingDeadlines(upcoming);
      setShowNotification(true);

      // Auto-hide notification after 10 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.status ? "#f0fdf4" : "#fef2f2",
      color: "inherit",
      fontWeight: "500",
      fontSize: "0.85rem",
      display: "flex",
      alignItems: "center",
      border: "none",
      borderRadius: "6px",
      padding: "2px 4px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
  });

  const dayPropGetter = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      style: {
        backgroundColor:
          date.toDateString() === today.toDateString() ? "#f5f3ff" : "white",
        borderRight: "1px solid #eee",
        borderBottom: "1px solid #eee",
      },
    };
  };

  return (
    <div className="min-h-screen px-4 py-8 pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification Bell */}
      <div className="fixed z-50 top-12 right-4 ">
        <button
          onClick={() => setShowNotification(!showNotification)}
          className="relative p-3 text-white rounded-full shadow-lg bg-primary hover:bg-yellow-500 focus:outline-none"
        >
          <FaBell className="text-xl" />
          {upcomingDeadlines.length > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
              {upcomingDeadlines.length}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotification && (
          <div className="absolute right-0 w-64 mt-2 overflow-hidden bg-white rounded-lg shadow-xl top-14">
            <div className="p-4 bg-primary">
              <h3 className="font-semibold text-white">Upcoming Deadlines</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="p-3">
                    <p className="font-medium text-gray-800">{deadline.name}</p>
                    <p className="text-sm text-gray-600">
                      Due: {deadline.date} ({deadline.daysLeft} day
                      {deadline.daysLeft !== 1 ? "s" : ""} left)
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-600">
                  No upcoming deadlines
                </div>
              )}
            </div>
            <div className="p-2 text-center bg-gray-50">
              <button
                onClick={() => setShowNotification(false)}
                className="text-sm text-primary hover:text-yellow-500"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-yellow-100 rounded-full text-primary">
            <FaCalendarAlt className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 font-display">
            Deadlines Calendar
          </h1>
          <p className="mt-2 text-gray-600">
            Track all your course deadlines in one place
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-6 p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-green-50">
              <FaCheckCircle className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Completed
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-50">
              <FaExclamationCircle className="text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Upcoming
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white shadow-md rounded-xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div style={{ height: "70vh" }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={["month"]}
                defaultView="month"
                date={new Date(2025, 3, 1)}
                toolbar={true}
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayPropGetter}
                popup
                components={{
                  toolbar: (props) => (
                    <div className="flex items-center justify-between p-4 border-b">
                      <button
                        onClick={() => props.onNavigate("PREV")}
                        className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                      ></button>
                      <span className="text-lg font-semibold text-gray-800">
                        {format(props.date, "MMMM yyyy")}
                      </span>
                      <button
                        onClick={() => props.onNavigate("NEXT")}
                        className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                      ></button>
                    </div>
                  ),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCalendar;
