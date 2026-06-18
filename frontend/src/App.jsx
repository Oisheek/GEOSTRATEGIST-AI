import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import IntroLoader from "./components/ui/IntroLoader";
import MobileNav from "./components/MobileNav";

function App() {
  const [showIntro, setShowIntro] =
    useState(
      !sessionStorage.getItem("introSeen")
    );

  if (showIntro) {
    return (
      <IntroLoader
        onComplete={() => {
          sessionStorage.setItem(
            "introSeen",
            "true"
          );
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <>
      <MobileNav />
      <AppRoutes />
    </>
  );
}

export default App;