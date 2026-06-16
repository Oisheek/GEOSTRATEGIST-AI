import { useState } from "react";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 border border-violet-500/20">
        <h2 className="text-2xl font-bold mb-4">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <form className="space-y-4">
          {mode === "signup" && (
            <input
              placeholder="Name"
              className="w-full p-3 rounded-lg bg-slate-800"
            />
          )}

          <input
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-slate-800"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-slate-800"
          />

          <button
            type="submit"
            className="w-full bg-violet-600 py-3 rounded-lg"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
          className="mt-4 text-violet-400"
        >
          {mode === "login"
            ? "Create an account"
            : "Already have an account?"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 block text-slate-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}