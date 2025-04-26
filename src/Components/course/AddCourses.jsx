import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- IMPORT THIS
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCourses = () => {
  const [form, setForm] = useState({
    courseName: "",
    subjectName: "",
    deadline: "",
    chapters: "",
    task: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- INITIALIZE HERE

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue!");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/courses/createCourse",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Course created:", response.data);
      toast.success("Course successfully created!");

      setTimeout(() => {
        navigate("/courses"); // <-- Navigate after a short delay
      }, 1500); // 1.5 seconds delay to show success toast
    } catch (error) {
      console.error(
        "Error creating course:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login to continue.");
      } else {
        toast.error("Failed to create course. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-24 bg-gradient-to-br from-gray-50 to-gray-100 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create New Course
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Fill in the details to add a new course to the system
          </p>
        </div>

        <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="courseName"
                      value={form.courseName}
                      onChange={handleChange}
                      placeholder="Advanced Mathematics"
                      className="block w-full px-4 py-3 transition duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="subjectName"
                      value={form.subjectName}
                      onChange={handleChange}
                      placeholder="Mathematics"
                      className="block w-full px-4 py-3 transition duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 transition duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Chapters <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      name="chapters"
                      value={form.chapters}
                      onChange={handleChange}
                      placeholder="12"
                      min="1"
                      className="block w-full px-4 py-3 transition duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Task Description <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    name="task"
                    value={form.task}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe the course tasks and objectives..."
                    className="block w-full px-4 py-3 transition duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3 text-lg font-medium text-white transition duration-200 rounded-lg shadow-md sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourses;
