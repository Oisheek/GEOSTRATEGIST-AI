import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  registerUser,
} from "../services/authService";

export default function Register() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      if (
        form.password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match"
        );
        return;
      }

      try {
        setLoading(true);

        await registerUser(
          form
        );

        navigate(
          "/login"
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Registration failed"
        );
      } finally {
        setLoading(false);
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
      <div
        className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_70%)]
      "
      />

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
            Create Account
          </h2>

          <p
            className="
            mt-3
            text-slate-400
          "
          >
            Join GeoStrategist AI
          </p>
        </div>

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
            <User
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
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target.value,
                })
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
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
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
              value={
                form.password
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
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
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
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
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
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
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm">
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

              hover:bg-cyan-400
              transition-all
            "
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-slate-400">
            Already have an account?
          </span>

          <Link
            to="/login"
            className="
              ml-2
              text-cyan-400
              hover:text-cyan-300
              font-medium
            "
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}