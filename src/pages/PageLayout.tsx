import React from "react";
import { LanguageSwitcher, ThemeToggle } from "../components";
import { useAxiosInterceptor } from "../utils/api";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  useAxiosInterceptor();

  return (
    <div className="flex flex-col items-center justify-between h-screen w-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="w-64 pt-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      {children}
      <div></div>
    </div>
  );
};

export default PageLayout;
