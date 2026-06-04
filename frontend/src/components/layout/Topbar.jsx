import useAuthStore from "../../store/authStore";

export default function Topbar() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="font-semibold">
        Dashboard
      </h1>

      <div>
        {user?.name || "User"}
      </div>
    </header>
  );
}