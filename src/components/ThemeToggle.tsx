import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { IconButton } from "../components";
import atoms from "../atoms";
import assets from "../assets";

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
    <>
      <IconButton
        onClick={toggleTheme}
        icon={
          theme === "light" ? (
            <assets.icons.lib.moon />
          ) : (
            <assets.icons.lib.sun />
          )
        }
      />
    </>
  );
};

export default ThemeToggle;
