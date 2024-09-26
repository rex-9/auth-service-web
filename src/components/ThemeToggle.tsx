import React, { useEffect, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import LocalStorageService from "../services/LocalStorageService";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<string>(
    () => LocalStorageService.getItem<string>("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    LocalStorageService.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <PrimaryBtn onClick={toggleTheme}>
      {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    </PrimaryBtn>
  );
};

export default ThemeToggle;
