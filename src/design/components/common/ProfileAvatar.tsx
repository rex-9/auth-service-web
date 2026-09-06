// src/design/components/common/ProfileAvatar.tsx

import React, { useState } from "react";
import { Image } from "../";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import AppRoutes from "../../../AppRoutes";
import { ComponentSize, ComponentSizes } from "../../constants";
import { cn } from "../../helpers";

export interface IProfileAvatarProps {
  className?: string;
  src?: string | null;
  alt?: string;
  size?: ComponentSize;
  onClick?: () => void;
}

export const ProfileAvatar: React.FC<IProfileAvatarProps> = ({
  className,
  src,
  alt,
  size = ComponentSizes.MD,
  onClick,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const effectiveSrc = src !== undefined ? src : currentUser?.avatar_url;
  const effectiveName =
    alt || currentUser?.name || currentUser?.username || "User";

  const sizeClasses: Record<ComponentSize, string> = {
    [ComponentSizes.XS]: "w-6 h-6 text-xs",
    [ComponentSizes.SM]: "w-8 h-8 text-sm",
    [ComponentSizes.MD]: "w-10 h-10 text-base",
    [ComponentSizes.LG]: "w-16 h-16 text-2xl",
    [ComponentSizes.XL]: "w-20 h-20 text-3xl",
  };

  const getInitialLetter = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(AppRoutes.client.protected.PROFILE);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center cursor-pointer select-none",
        className,
      )}
      onClick={handleClick}
    >
      {effectiveSrc && !imageError ? (
        <Image
          asset={{ src: effectiveSrc, alt: `${effectiveName}'s avatar` }}
          className={cn("rounded-full object-cover", sizeClasses[size])}
          onError={handleImageError}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-bold text-primary bg-base-200 hover:bg-base-300 border border-glass-border shadow-sm",
            sizeClasses[size],
          )}
        >
          {getInitialLetter(effectiveName)}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
