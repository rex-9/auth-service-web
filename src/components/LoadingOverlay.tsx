import { FC } from "react";
import { useLoading } from "../contexts";

const LoadingOverlay: FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center z-50">
      <span className="loading loading-spinner loading-md"></span>
    </div>
  );
};

export default LoadingOverlay;
