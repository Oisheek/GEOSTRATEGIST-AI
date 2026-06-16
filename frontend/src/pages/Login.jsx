import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { loginUser } from "../services/authService";
import api from "../services/api";
import useAuthStore from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const res =
          await loginUser({
            email,
            password,
          });

        setAuth(
          res.data.user,
          res.data.token
        );

        navigate("/");
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleGoogleLogin =
    async (
      credentialResponse
    ) => {
      try {
        const res =
          await api.post(
            "/auth/google",
            {
              token:
                credentialResponse.credential,
            }
          );

        setAuth(
          res.data.user,
          res.data.token
        );

        navigate("/");
      } catch (err) {
        console.error(err);

        setError(
          "Google Login Failed"
        );
      }
    };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#020617]
      relative
      overflow-hidden
      px-4
    "
    >
      {/* Background Glow */}
      <div
        className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_70%)]
      "
      />

      {/* Back Button */}
      <button
        onClick={() =>
          navigate(-1)
        }
        className="
          absolute
          top-6
          left-6

          h-11
          w-11

          flex
          items-center
          justify-center

          rounded-xl

          bg-[#0F172A]

          border
          border-cyan-500/20

          text-cyan-400

          hover:bg-[#172036]

          transition
        "
      >
        <ArrowLeft size={18} />
      </button>

      {/* Card */}
      <div
        className="
        relative

        w-full
        max-w-md

        bg-[#0F172A]/90
        backdrop-blur-xl

        border
        border-cyan-500/20

        rounded-[28px]

        px-8
        py-10

        shadow-[0_0_50px_rgba(34,211,238,0.12)]
      "
      >
        {/* Header */}
        <div className="text-center">
          <h1
            className="
            text-4xl
            font-bold

            bg-gradient-to-r
            from-cyan-400
            via-blue-400
            to-violet-400

            bg-clip-text
            text-transparent
          "
          >
            GeoStrategist AI
          </h1>

          <h2
            className="
            text-3xl
            font-bold
            text-white
            mt-6
          "
          >
            Welcome Back
          </h2>

          <p
            className="
            mt-3
            text-slate-400
          "
          >
            Sign in to access
            geopolitical intelligence
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="
          mt-10
          space-y-5
        "
        >
          <div className="relative">
            <Mail
              size={18}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="
                w-full
                h-14

                rounded-full

                bg-slate-900/70

                border
                border-slate-700

                pl-12
                pr-5

                text-white

                placeholder:text-slate-500

                outline-none

                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
              "
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                w-full
                h-14

                rounded-full

                bg-slate-900/70

                border
                border-slate-700

                pl-12
                pr-12

                text-white

                placeholder:text-slate-500

                outline-none

                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="
                text-cyan-400
                text-sm
                hover:text-cyan-300
              "
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div
              className="
                text-red-400
                text-sm
              "
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-14

              rounded-full

              bg-cyan-500

              text-black

              font-bold

              transition-all

              hover:bg-cyan-400
              hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]

              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>
        </form>

        <div
          className="
          mt-6
          flex
          justify-center
        "
        >
          <GoogleLogin
            onSuccess={
              handleGoogleLogin
            }
            onError={() =>
              setError(
                "Google Login Failed"
              )
            }
          />
        </div>

        <div
          className="
          mt-8
          text-center
        "
        >
          <span
            className="
            text-slate-400
          "
          >
            Don't have an account?
          </span>

          <Link
            to="/register"
            className="
              ml-2
              text-cyan-400
              hover:text-cyan-300
              font-medium
            "
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

