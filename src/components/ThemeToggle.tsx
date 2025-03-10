import { FC } from "react";
import { useAtom } from "jotai";
import { Button } from ".";
import atoms from "../atoms";
import { SupportedTheme } from "../constants";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const ThemeToggle: FC = () => {
  const [theme, setTheme] = useAtom(atoms.themeAtom);

  const toggleTheme = () => {
    const newTheme: SupportedTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <Button onClick={toggleTheme} variant="icon" className="w-8 h-8">
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeToggle;
