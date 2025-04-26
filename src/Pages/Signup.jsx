import React, { useState } from "react";
import axios from "axios";

const Signup = ({ switchToLogin, closeModal, onSignupSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        form
      );

      localStorage.setItem("token", response.data.token);

      // Call the success handler with user data
      onSignupSuccess({
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "Signup failed! Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md sm:p-10">
      <h2 className="mb-6 text-3xl font-extrabold text-center text-primary">
        Student Signup
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg"
          required
          minLength="6"
        />
        <button
          type="submit"
          className="py-2 text-white rounded bg-primary hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="font-medium text-primary hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
