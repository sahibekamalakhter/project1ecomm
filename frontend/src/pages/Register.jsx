import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (name === "" || email === "" || password === "" || role === "") {
      toast.error("Please fill all fields and choose account type");
      return;
    }

    try {
      const result = await axios.post("http://localhost:8001/auth/register", {
        name: name,
        email: email,
        password: password,
        role: role,
      });

      if (result.data.success) {
        toast.success(
          result.data.message ||
            "Registration successful. Please check your email to verify your account."
        );
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed");
      }
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md rounded border border-blue-200 bg-white p-6">
        <h1 className="mb-5 text-center text-2xl font-bold text-blue-900">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="mb-1 block font-semibold text-blue-900">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-blue-300 px-3 py-2 text-blue-900"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-semibold text-blue-900">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-blue-300 px-3 py-2 text-blue-900"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-semibold text-blue-900">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-blue-300 px-3 py-2 text-blue-900"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-semibold text-blue-900">
              Choose Account Type
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === "buyer"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Buyer Account
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === "seller"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Seller Account
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded border border-blue-900 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-blue-900">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
