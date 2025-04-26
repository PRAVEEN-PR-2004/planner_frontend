import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Timetable", path: "/timetable" },
    { name: "Suggestions", path: "/suggestion" },
    { name: "Courses", path: "/courses" },
    { name: "Calendar", path: "/calendar" },
  ];

  const openLoginModal = () => {
    setShowLogin(true);
    setIsModalOpen(true);
  };

  const openSignupModal = () => {
    setShowLogin(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAuthSuccess = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.name || userData.email.split("@")[0]);
    localStorage.setItem(
      "username",
      userData.name || userData.email.split("@")[0]
    );
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        <Link
          to="/"
          className="text-xl font-bold tracking-wider sm:text-2xl text-primary"
        >
          Academic Planner
        </Link>

        {/* Desktop Links */}
        <ul className="hidden space-x-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-black transition duration-300 hover:text-primary"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile / Login Button (Desktop) */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">
                Welcome, {username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={openLoginModal}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="px-3 py-1 text-sm font-medium text-blue-500 bg-white border border-blue-500 rounded hover:bg-blue-50"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "block" : "hidden"
        } bg-white px-4 pb-4`}
      >
        <ul className="flex flex-col items-center pt-2 space-y-3 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.name} className="w-full text-center">
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block w-full py-2 text-black transition hover:text-primary"
              >
                {link.name}
              </Link>
            </li>
          ))}
          {/* User Profile / Login Button (Mobile) */}
          <li className="w-full">
            {isLoggedIn ? (
              <div className="flex flex-col items-center space-y-3">
                <span className="font-medium text-gray-700">
                  Welcome, {username}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full space-y-3">
                <button
                  onClick={() => {
                    openLoginModal();
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openSignupModal();
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm font-medium text-center text-blue-500 bg-white border border-blue-500 rounded hover:bg-blue-50"
                >
                  Sign Up
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Modal Popup for Login/Signup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <button
              onClick={closeModal}
              className="absolute text-gray-500 top-4 right-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {showLogin ? (
              <Login
                switchToSignup={openSignupModal}
                closeModal={closeModal}
                onLoginSuccess={handleAuthSuccess}
              />
            ) : (
              <Signup
                switchToLogin={openLoginModal}
                closeModal={closeModal}
                onSignupSuccess={handleAuthSuccess}
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
