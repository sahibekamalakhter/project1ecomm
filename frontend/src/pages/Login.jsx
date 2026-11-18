import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();

    if (email === "" || password === "") {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const result = await axios.post("http://localhost:8001/auth/login", {
        email: email,
        password: password,
      });

      if (result.data.success) {
        loginUser(result.data.token, result.data.user);
        toast.success("Login successful");
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        const msg = err.response.data.message;
        toast.error(msg);
        if (msg.includes("verify your email")) {
          setShowResend(true);
        }
      } else {
        toast.error("Login failed");
      }
    }
  }

  async function handleResend() {
    if (email === "") {
      toast.error("Please enter your email first");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:8001/auth/resend-verification",
        { email: email }
      );
      if (result.data.success) {
        toast.success(result.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Could not resend verification email");
      }
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md rounded border border-blue-200 bg-white p-6">
        <h1 className="mb-5 text-center text-2xl font-bold text-blue-900">Login</h1>
        <form onSubmit={handleLogin}>
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

          <button
            type="submit"
            className="w-full rounded border border-blue-900 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {showResend && (
          <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-center">
            <p className="mb-2 text-sm text-blue-900">
              Your email is not verified. Check your inbox or resend the verification email.
            </p>
            <button
              type="button"
              onClick={handleResend}
              className="rounded border border-blue-900 bg-white px-4 py-2 text-blue-900 hover:bg-blue-100"
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-blue-900">
          New user?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
