import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Clock,
  Calendar,
} from "lucide-react";
import format from "date-fns/format";
import { motion, AnimatePresence } from "framer-motion";

const Timetable = () => {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewCard, setShowReviewCard] = useState(true);
  const today = new Date();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    fetch("http://localhost:5000/courses/myCourses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!courses.length) return;

    const pending = courses.filter((c) => !c.status);
    const completed = courses.filter((c) => c.status);
    const blocks = [];

    pending.forEach((c, i) => {
      const startHour = 8 + i * 2;
      if (startHour + 2 > 20) return;
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        startHour,
        0
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        startHour + 2,
        0
      );
      blocks.push({
        title: `${c.courseName}`,
        subject: c.subjectName,
        start,
        end,
        status: c.status,
        course: c,
        type: "study",
      });
    });

    if (completed.length) {
      blocks.push({
        title: "Review Session",
        subject: completed.map((c) => c.courseName).join(", "),
        start: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          17,
          0
        ),
        end: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          18,
          0
        ),
        status: true,
        type: "review",
      });

      blocks.push({
        title: "Revision Time",
        subject: completed.map((c) => c.courseName).join(", "),
        start: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          19,
          0
        ),
        end: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          20,
          0
        ),
        status: true,
        type: "revision",
      });
    }

    setEvents(blocks.sort((a, b) => a.start - b.start));
  }, [courses]);

  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  const getEventIcon = (type) => {
    switch (type) {
      case "review":
        return <BookOpen className="w-4 h-4 text-blue-600 md:w-5 md:h-5" />;
      case "revision":
        return (
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
        );
      default:
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />;
    }
  };

  const getTimeSlotHeight = (start, end) => {
    const duration = (end - start) / (1000 * 60 * 60);
    return `${duration * 60}px`;
  };

  const getEventColor = (type) => {
    switch (type) {
      case "review":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "revision":
        return "bg-emerald-50 border-emerald-200 hover:bg-emerald-100";
      default:
        return "bg-amber-50 border-amber-200 hover:bg-amber-100";
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "review":
        return "border-l-blue-500";
      case "revision":
        return "border-l-emerald-500";
      default:
        return "border-l-amber-500";
    }
  };

  const completedCourses = courses.filter((c) => c.status);

  return (
    <div className="max-w-6xl min-h-screen p-3 pt-20 mx-auto mt-3 sm:p-4 sm:pt-24 lg:pt-16">
      <div className="mt-2 mb-6 text-center sm:mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold sm:text-2xl lg:text-3xl text-slate-800"
        >
          Daily Study Planner
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-1 text-base sm:mt-2 sm:text-lg text-slate-600"
        >
          {formattedDate}
        </motion.p>
      </div>

      {/* Review Completed Card - Centered at the top */}
      {completedCourses.length > 0 && (
        <AnimatePresence>
          {showReviewCard && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl p-4 mx-auto mb-8 border border-blue-100 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
            >
              <button
                onClick={() => setShowReviewCard(false)}
                className="absolute p-1 text-blue-400 rounded-full top-2 right-2 hover:bg-blue-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 mr-4 bg-white rounded-lg shadow-xs">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    Review Completed Courses
                  </h3>
                  <p className="mt-1 text-sm text-blue-600">
                    You have {completedCourses.length} completed course
                    {completedCourses.length > 1 ? "s" : ""} to review today.
                  </p>
                  <div className="flex items-center mt-3 space-x-4">
                    <div className="flex items-center text-sm text-blue-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>5:00 PM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-white rounded-full">
                      {completedCourses.map((c) => c.courseName).join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-[3px] border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : (
        <div className="relative p-3 bg-white border rounded-lg shadow-sm sm:p-4 md:p-6 sm:rounded-xl border-slate-200">
          {/* Timeline */}
          <div
            className="absolute left-0 h-full border-r border-slate-200"
            style={{ left: "40px" }}
          ></div>

          {/* Time markers */}
          <div
            className="absolute left-0 w-full"
            style={{ top: "-10px", left: "40px" }}
          >
            {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
              <div
                key={hour}
                className="absolute text-xs font-medium sm:text-sm text-slate-500"
                style={{
                  top: `${(hour - 8) * 60}px`,
                  left: "-35px",
                }}
              >
                {hour <= 12
                  ? `${hour} AM`
                  : hour === 12
                  ? `${hour} PM`
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Events */}
          <div className="relative" style={{ marginLeft: "50px" }}>
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`absolute w-full rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 mb-1 sm:mb-2 border ${getEventColor(
                  event.type
                )} ${getBorderColor(
                  event.type
                )} border-l-4 transition-all duration-200 cursor-pointer group`}
                style={{
                  top: `${
                    (event.start.getHours() - 8) * 60 +
                    (event.start.getMinutes() / 60) * 60
                  }px`,
                  height: getTimeSlotHeight(event.start, event.end),
                }}
              >
                <div className="flex items-start h-full">
                  <div className="flex items-center justify-center p-1 mr-2 transition-transform bg-white rounded-full shadow-xs sm:p-2 sm:mr-3 group-hover:scale-110">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex flex-col justify-between w-full h-full overflow-hidden">
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-semibold truncate sm:text-base text-slate-800">
                        {event.title}
                      </h3>
                      <p className="text-xs truncate sm:text-sm text-slate-600">
                        {event.subject}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                      <p className="text-xs font-medium text-slate-500 whitespace-nowrap">
                        {format(event.start, "h:mm a")} -{" "}
                        {format(event.end, "h:mm a")}
                      </p>
                      {event.type === "study" && !event.status && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="flex-shrink-0 w-3 h-3 ml-1 transition-all sm:w-4 sm:h-4 sm:ml-2 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mt-6 sm:gap-3 md:gap-4 sm:mt-8"
      >
        <div className="flex items-center px-3 py-1 bg-white border rounded-md shadow-xs sm:px-4 sm:py-2 sm:rounded-lg border-slate-200">
          <div className="w-2 h-2 mr-1 rounded-full sm:w-3 sm:h-3 sm:mr-2 bg-amber-500"></div>
          <span className="text-xs font-medium sm:text-sm text-slate-700">
            Pending
          </span>
        </div>
        <div className="flex items-center px-3 py-1 bg-white border rounded-md shadow-xs sm:px-4 sm:py-2 sm:rounded-lg border-slate-200">
          <div className="w-2 h-2 mr-1 rounded-full sm:w-3 sm:h-3 sm:mr-2 bg-emerald-500"></div>
          <span className="text-xs font-medium sm:text-sm text-slate-700">
            Completed
          </span>
        </div>
        <div className="flex items-center px-3 py-1 bg-white border rounded-md shadow-xs sm:px-4 sm:py-2 sm:rounded-lg border-slate-200">
          <div className="w-2 h-2 mr-1 bg-blue-500 rounded-full sm:w-3 sm:h-3 sm:mr-2"></div>
          <span className="text-xs font-medium sm:text-sm text-slate-700">
            Review
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Timetable;
