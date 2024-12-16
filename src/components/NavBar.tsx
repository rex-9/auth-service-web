import React from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileAvatar from "./ProfileAvatar";

const NavBar: React.FC = () => {
  return (
    <nav className="flex gap-2 justify-between items-center w-full p-2">
      <div>
        <ProfileAvatar className="ml-auto" />
      </div>
      <div className="flex gap-2 items-center px-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default NavBar;
