import React from "react";
import { useAxiosInterceptor } from "../utils/api";
import { NavBar } from "../components";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  useAxiosInterceptor();

  return (
    <div className="flex flex-col items-center justify-between h-screen w-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <NavBar />
      {children}
      <div></div>
    </div>
  );
};

export default PageLayout;
