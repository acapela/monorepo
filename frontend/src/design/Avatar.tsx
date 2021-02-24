import classNames from "classnames";
import { useState } from "react";
import { getInitials } from "../utils";

export interface AvatarProps {
  url?: string;
  className?: string;
  name: string;
}

const baseAvatarClasses =
  "w-11 h-11 rounded-full border-2 border-bg-gray-200 relative flex justify-center items-center";

export const Avatar: React.FC<AvatarProps> = ({ url, name, className }) => {
  const [failedToLoad, setFailedToLoad] = useState(false);
  if (url && !failedToLoad) {
    return (
      <div className={classNames(baseAvatarClasses, className)}>
        <img
          className="absolute rounded-full object-cover"
          src={url}
          alt={`${name}'s avatar`}
          onError={() => setFailedToLoad(true)}
        />
        <div className="shadow-inner absolute inset-0 rounded-full" />
      </div>
    );
  }
  const initials = getInitials(name);
  return <span className={classNames(baseAvatarClasses, "bg-blue-400 font-semibold", className)}>{initials}</span>;
};

export const AvatarList: React.FC<{ avatars: AvatarProps[] }> = ({ avatars }) => {
  return (
    <div className="flex -space-x-3">
      {avatars.map((avatar, index) => (
        <Avatar key={index} {...avatar} />
      ))}
    </div>
  );
};
