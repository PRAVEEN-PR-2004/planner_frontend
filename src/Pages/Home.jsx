import React from "react";
import homeimg from "../images/image.png";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <section className="lg:w-9/12 md:w-[90%] mx-auto mt-12 flex flex-col-reverse md:flex-row-reverse justify-between items-center px-4">
      <div className="w-full mt-8 md:mt-0 md:w-1/2 lg:mt-16">
        {/* Add margin-top for small screens */}
        <img src={homeimg} alt="banner" className="w-full mx-auto" />
      </div>

      <div className="w-full mt-8 space-y-8 md:mt-0 md:w-1/2">
        <h2 className="my-8 lg:text-4xl text-3xl font-medium text-[#333] md:w-4/6 lg:leading-normal leading-normal mb-3">
          Plan Your Academic Journey with Ease
        </h2>
        <p className="py-2 pl-2 mb-6 text-gray-500 border-l-4">
          Our Academic Planner helps you organize, track, and plan your studies
          for a smoother academic experience.
        </p>
        <div className="flex flex-col items-center mb-6 md:flex-row md:space-x-3">
          <Link to="/courses">
            <button className="w-full px-6 py-2 mb-8 text-white rounded md:w-auto bg-primary md:mb-0">
              Add Courses
            </button>
          </Link>

          <Link to="/suggestion">
            <button className="inline-flex items-center justify-center w-full px-6 py-2 transition-all duration-300 ease-in border rounded md:w-auto text-primary hover:bg-primary hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
              <span className="flex items-center">Need Suggestion</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
