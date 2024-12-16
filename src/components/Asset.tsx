import React from "react";

interface AssetProps {
  asset: {
    src: string;
    alt: string;
    title?: string;
  };
  className?: string;
  onError?: () => void;
}

const Asset: React.FC<AssetProps> = ({ asset, className, onError }) => {
  return (
    <img
      src={asset.src}
      alt={asset.alt}
      aria-label={asset.alt}
      title={asset.title ?? asset.alt}
      className={className}
      loading="lazy"
      onError={onError ?? undefined}
    />
  );
};

export default Asset;
