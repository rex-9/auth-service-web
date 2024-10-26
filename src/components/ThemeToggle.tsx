import React, { useEffect, useState } from "react";
import TextButton from "./TextButton";
import { localStorageService } from "../services";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<string>(
    () => localStorageService.getItem<string>("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorageService.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <TextButton
      variant="primary"
      onClick={toggleTheme}
      label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    />
  );
};

export default ThemeToggle;
