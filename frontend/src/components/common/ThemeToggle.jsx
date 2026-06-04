import useThemeStore
from "../../store/themeStore";

export default function ThemeToggle() {

  const {
    theme,
    setTheme
  } = useThemeStore();

  const toggleTheme = () => {
    setTheme(
      theme === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <button
      onClick={toggleTheme}
    >
      {theme === "light"
        ? "🌙"
        : "☀️"}
    </button>
  );
}