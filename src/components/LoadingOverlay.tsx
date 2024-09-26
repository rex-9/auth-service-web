import React from "react";
import { useLoading } from "../contexts/LoadingContext";

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );
};

export default LoadingOverlay;
