import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnalyticsService } from "../services";

export const AnalyticsPageView = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    void AnalyticsService.logViewPage(pathname, document.title);
  }, [pathname]);

  return null;
};
