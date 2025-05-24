import { FC } from "react";
import { useLoading } from "../contexts";

const LoadingOverlay: FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <div className="text-white text-lg">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
