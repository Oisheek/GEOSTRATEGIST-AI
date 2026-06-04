import { useState } from "react";

import {
  loginUser,
} from "../services/authService";

import useAuthStore
  from "../store/authStore";

export default function Login() {

  const setAuth =
    useAuthStore(
      (state) =>
        state.setAuth
    );

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const res =
        await loginUser({
          email,
          password,
        });

      setAuth(
        res.data.user,
        res.data.token
      );
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
    >
      <input
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <input
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button>
        Login
      </button>
    </form>
  );
}