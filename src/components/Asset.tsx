import React from "react";

interface AssetProps {
  asset: {
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
}

const Asset: React.FC<AssetProps> = ({ asset, className }) => (
  <img
    src={asset.src}
    alt={asset.alt}
    aria-label={asset.alt}
    title={asset.title}
    className={className}
    loading="lazy"
  />
);

export default Asset;
