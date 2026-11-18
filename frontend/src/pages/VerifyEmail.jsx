import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyEmail() {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Verification token is missing.");
        setSuccess(false);
        setLoading(false);
        return;
      }

      try {
        const result = await axios.post("http://localhost:8001/auth/verify-email", {
          token: token,
        });

        if (result.data.success) {
          setMessage(result.data.message);
          setSuccess(true);
        } else {
          setMessage(result.data.message || "Verification failed.");
          setSuccess(false);
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Verification failed. Please try again.");
        }
        setSuccess(false);
      }

      setLoading(false);
    }

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-lg rounded border border-blue-200 bg-white p-8 text-center">
        {loading && <p className="text-blue-900">Verifying your email...</p>}

        {!loading && success && (
          <div>
            <h1 className="mb-4 text-3xl font-bold text-blue-900">
              Email Verified Successfully!
            </h1>
            <p className="mb-6 text-blue-900">
              Your account has been activated. You can now log in.
            </p>
            <Link
              to="/login"
              className="inline-block rounded border border-blue-900 bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        )}

        {!loading && !success && (
          <div>
            <h1 className="mb-4 text-2xl font-bold text-blue-900">
              Verification Failed
            </h1>
            <p className="mb-6 text-blue-900">{message}</p>
            <Link
              to="/login"
              className="inline-block rounded border border-blue-900 bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
