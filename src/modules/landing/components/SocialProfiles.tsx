// src/modules/landing/components/SocialProfiles.tsx

import React from "react";
import { Asset, TextLink } from "../../../design";
import { ISocialProfile } from "../types";

export interface ISocialProfilesProps {
  profiles: ISocialProfile[];
  className?: string;
}

export const SocialProfiles: React.FC<ISocialProfilesProps> = ({
  profiles,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-wrap justify-center items-center gap-3 sm:gap-4 my-6 ${className}`}
    >
      {profiles.map((profile) => {
        const isRaster =
          profile.iconSrc.includes(".jpeg") ||
          profile.iconSrc.includes(".jpg") ||
          profile.iconSrc.includes(".png");

        return (
          <TextLink
            key={profile.platform}
            href={profile.link}
            external
            title={profile.platform}
            className="group inline-flex items-center justify-center p-1 transition-all duration-300 hover:-translate-y-1 hover:no-underline"
          >
            <Asset
              src={profile.iconSrc}
              alt={profile.platform}
              className={`w-7 h-7 object-contain transition-all duration-300 ${
                isRaster
                  ? "rounded-md drop-shadow-[0_0_3px_rgba(255,34,56,0.45)] group-hover:drop-shadow-[0_0_6px_var(--color-glow-white)]"
                  : "drop-shadow-neon group-hover:drop-shadow-neon-hover group-hover:scale-110"
              }`}
            />
          </TextLink>
        );
      })}
    </div>
  );
};
