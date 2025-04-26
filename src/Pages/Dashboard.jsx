import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/courses/myCourses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        setCourses(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Data preparation
  const totalChapters = courses.reduce((sum, c) => sum + c.chapters, 0);
  const completedCourses = courses.filter((c) => c.status).length;
  const pendingCourses = courses.length - completedCourses;
  const completedChapters = courses.reduce(
    (sum, c) => sum + c.completedChapters,
    0
  );
  const pendingChapters = totalChapters - completedChapters;

  const chapterData = courses.map((c) => ({
    name: c.courseName,
    chapters: c.chapters,
    completedChapters: c.completedChapters,
    pendingChapters: c.chapters - c.completedChapters,
  }));

  const statusData = [
    { name: "Completed", value: completedCourses },
    { name: "Pending", value: pendingCourses },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"];
  const KPI_COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 bg-gradient-to-br from-gray-50 to-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-6 p-6 bg-white shadow-sm rounded-xl md:flex-row md:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Learning Dashboard
            </h1>
            <p className="mt-1 text-gray-500">
              Track your course progress and achievements
            </p>
          </div>
          <div className="px-4 py-2 text-sm font-medium text-blue-600 rounded-full bg-blue-50">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            ["Total Courses", courses.length, "text-blue-600", "bg-blue-50"],
            ["Completed", completedCourses, "text-green-600", "bg-green-50"],
            ["Pending", pendingCourses, "text-amber-600", "bg-amber-50"],
            [
              "Total Chapters",
              totalChapters,
              "text-purple-600",
              "bg-purple-50",
            ],
            ["Completed", completedChapters, "text-green-600", "bg-green-50"],
            ["Pending", pendingChapters, "text-amber-600", "bg-amber-50"],
          ].map(([label, value, textColor, bgColor], index) => (
            <div
              key={label}
              className={`p-5 rounded-xl shadow-sm transition-all hover:shadow-md ${bgColor}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <div
                  className={`p-2 rounded-lg ${bgColor.replace("50", "100")}`}
                >
                  <span className="text-lg font-semibold">
                    {index === 0 && "📚"}
                    {index === 1 && "✅"}
                    {index === 2 && "⏳"}
                    {index === 3 && "📖"}
                    {index === 4 && "✔️"}
                    {index === 5 && "⌛"}
                  </span>
                </div>
              </div>
              <p className={`mt-2 text-2xl font-bold ${textColor}`}>{value}</p>
              {index === 1 && completedCourses > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  {Math.round((completedCourses / courses.length) * 100)}%
                  completion rate
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Bar Chart Card */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Chapters Progress
              </h2>
              <div className="flex space-x-2">
                <span className="flex items-center text-xs text-gray-500 before:w-2 before:h-2 before:mr-1 before:rounded-full before:bg-blue-500">
                  Total
                </span>
                <span className="flex items-center text-xs text-gray-500 before:w-2 before:h-2 before:mr-1 before:rounded-full before:bg-green-500">
                  Completed
                </span>
                <span className="flex items-center text-xs text-gray-500 before:w-2 before:h-2 before:mr-1 before:rounded-full before:bg-amber-500">
                  Pending
                </span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chapterData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barSize={20}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="chapters"
                    name="Total"
                    radius={[4, 4, 0, 0]}
                    fill={COLORS[2]}
                  />
                  <Bar
                    dataKey="completedChapters"
                    name="Completed"
                    radius={[4, 4, 0, 0]}
                    fill={COLORS[0]}
                  />
                  <Bar
                    dataKey="pendingChapters"
                    name="Pending"
                    radius={[4, 4, 0, 0]}
                    fill={COLORS[1]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Course Completion
              </h2>
              <p className="text-sm text-gray-500">
                Overview of your course status
              </p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload && payload.length ? (
                        <div className="p-3 text-sm bg-white rounded-lg shadow-lg">
                          <p className="font-semibold">{payload[0].name}</p>
                          <p>
                            {payload[0].value} course
                            {payload[0].value !== 1 ? "s" : ""}
                          </p>
                          <p className="text-gray-500">
                            {Math.round(
                              (payload[0].value / courses.length) * 100
                            )}
                            % of total
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {courses.length > 0 && (
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-6 text-lg font-semibold text-gray-800">
              Your Courses
            </h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Course
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Chapters
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
                            📚
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.courseName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {course.completedChapters} / {course.chapters}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{
                              width: `${
                                (course.completedChapters / course.chapters) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                            course.status
                              ? "text-green-800 bg-green-100"
                              : "text-amber-800 bg-amber-100"
                          }`}
                        >
                          {course.status ? "Completed" : "In Progress"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
