import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Layers,
  ClipboardList,
  CalendarDays,
  CheckCircle,
} from "lucide-react";

const DeleteCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
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
      }
    };

    fetchCourses();
  }, []);

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

  return (
    <div className="min-h-screen px-4 pt-28 sm:px-6 lg:px-8 bg-gray-50">
      <h1 className="mb-10 text-xl font-bold text-center text-primary sm:text-2xl md:text-3xl lg:text-3xl">
        Your Courses
      </h1>

      <div className="grid max-w-6xl gap-6 mx-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="flex flex-col justify-between h-[330px] p-6 transition-shadow duration-300 bg-white shadow-md rounded-2xl hover:shadow-xl"
            >
              <div className="space-y-4">
                <h2 className="pb-2 text-2xl font-bold text-center text-gray-800 border-b">
                  {course.courseName}
                </h2>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-primary mt-0.5" />
                  <span>
                    <strong>Subject:</strong> {course.subjectName}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Layers className="w-4 h-4 text-primary mt-0.5" />
                  <span>
                    <strong>Chapters:</strong> {course.chapters}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <ClipboardList className="w-4 h-4 text-primary mt-0.5" />
                  <span>
                    <strong>Task:</strong> {course.task}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4 text-primary mt-0.5" />
                  <span>
                    <strong>Deadline:</strong>{" "}
                    {new Date(course.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span>
                    <strong>Status:</strong>{" "}
                    {course.status ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="px-6 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete Course
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No courses found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeleteCourses;
