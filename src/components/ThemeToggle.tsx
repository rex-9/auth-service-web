import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { TextButton } from "../components";
import atoms from "../atoms";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useAtom(atoms.themeAtom);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: string) => (prevTheme === "light" ? "dark" : "light"));
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
