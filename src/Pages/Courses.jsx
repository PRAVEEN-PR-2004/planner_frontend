import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Layers,
  ClipboardList,
  CalendarDays,
  Plus,
  Trash2,
  Check,
  ChevronRight,
} from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/courses/myCourses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Delete a course
  const deleteCourse = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/courses/courses/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error("Error deleting course:", error.message);
    }
  };

  // Mark course as completed manually
  const markCourseAsCompleted = async (courseId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/courses/courses/${courseId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update course status");
      }

      const updatedCourse = await res.json();

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );
    } catch (error) {
      console.error("Error updating course status:", error.message);
    }
  };

  // Decrease chapters by 1
  const decreaseChapter = async (courseId) => {
    const token = localStorage.getItem("token");

    try {
      // First decrease the chapter count
      const decreaseRes = await fetch(
        `http://localhost:5000/courses/courses/${courseId}/decreaseChapter`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!decreaseRes.ok) {
        throw new Error("Failed to decrease chapter");
      }

      const updatedCourse = await decreaseRes.json();

      // Check if this was the last chapter
      if (updatedCourse.pendingChapters === 0) {
        // Automatically mark as completed
        const completeRes = await fetch(
          `http://localhost:5000/courses/courses/${courseId}/complete`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!completeRes.ok) {
          throw new Error("Failed to mark course as completed");
        }

        const completedCourse = await completeRes.json();

        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === completedCourse._id ? completedCourse : course
          )
        );
      } else {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === updatedCourse._id ? updatedCourse : course
          )
        );
      }
    } catch (error) {
      console.error("Error decreasing chapter:", error.message);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-16 bg-gradient-to-b from-gray-50 to-gray-100 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 mb-12 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              My Learning Journey
            </h1>
            <p className="mt-2 text-gray-600">
              Track and manage all your courses in one place
            </p>
          </div>

          <button
            onClick={() => navigate("/courses/addcourses")}
            className="items-center hidden gap-2 px-6 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-lg md:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </button>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-8 right-8 lg:hidden">
          <button
            onClick={() => navigate("/courses/addcourses")}
            className="flex items-center justify-center p-4 text-white rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-lg shadow-sm animate-pulse"
              >
                <div className="p-6 space-y-4">
                  <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className={`flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md ${
                  course.status ? "ring-1 ring-green-500/10" : ""
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {course.courseName}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {course.subjectName}
                      </p>
                    </div>
                    {course.status && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        <Check className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Progress Section */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-semibold text-indigo-600">
                          {course.chapters - course.pendingChapters}/
                          {course.chapters} chapters
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full">
                        <div
                          className="h-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                          style={{
                            width: `${
                              ((course.chapters - course.pendingChapters) /
                                course.chapters) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Task Section */}
                    <div className="p-4 rounded-lg bg-gray-50">
                      <div className="flex items-start gap-3">
                        <ClipboardList className="flex-shrink-0 w-5 h-5 mt-0.5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Current Task
                          </p>
                          <p className="text-gray-800 line-clamp-2">
                            {course.task}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Deadline Section */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="flex-shrink-0 w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Deadline
                          </p>
                          <p className="text-gray-800">
                            {new Date(course.deadline).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-3">
                    {course.pendingChapters > 0 ? (
                      <button
                        onClick={() => decreaseChapter(course._id)}
                        className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                      >
                        <Check className="w-4 h-4" />
                        Complete Chapter
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        <Check className="w-4 h-4" />
                        All Done
                      </button>
                    )}

                    {!course.status ? (
                      <button
                        onClick={() => markCourseAsCompleted(course._id)}
                        className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                      >
                        <Check className="w-4 h-4" />
                        Mark Complete
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        <Check className="w-4 h-4" />
                        Completed
                      </button>
                    )}

                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="flex items-center justify-center col-span-2 gap-1 px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white shadow-sm rounded-xl">
            <div className="p-5 mb-6 bg-indigo-100 rounded-full">
              <BookOpen className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">
              No courses yet
            </h3>
            <p className="max-w-md mb-8 text-gray-600">
              Start your learning journey by adding your first course. Track
              progress, set deadlines, and achieve your goals.
            </p>
            <button
              onClick={() => navigate("/courses/addcourses")}
              className="flex items-center gap-2 px-8 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
