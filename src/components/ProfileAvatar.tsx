import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Asset } from ".";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";

interface ProfileAvatarProps {
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ className }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  if (!currentUser) {
    return null;
  }

  const { profile_pic_url, username } = currentUser;

  const getInitialLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  const handleImageError = () => {
    if (setImageError) {
      setImageError(true);
    }
    console.error(`Failed to load asset: ${profile_pic_url}`);
  };

  return (
    <div
      className={`flex items-center justify-center ${className} cursor-pointer`}
      onClick={() => navigate(AppRoutes.client.protected.PROFILE)}
    >
      {profile_pic_url && !imageError ? (
        <Asset
          asset={{ src: profile_pic_url, alt: `${username}'s profile` }}
          className="w-10 h-10 rounded-full"
          onError={handleImageError}
        />
      ) : (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-primary-light dark:text-primary-dark bg-bg-dark dark:bg-bg-light hover:bg-hover-light dark:hover:bg-hover-dark">
          {getInitialLetter(username)}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
