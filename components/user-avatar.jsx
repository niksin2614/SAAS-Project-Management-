import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = ({ user, size = "sm" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 text-[9px]",
    md: "h-6 w-6 text-[10px]",
    lg: "h-8 w-8 text-xs",
  };

  return (
    <div className="flex items-center space-x-2">
      <Avatar
        className={`${
          sizeClasses[size] || sizeClasses.sm
        } border border-white/10 shadow-sm flex-shrink-0`}
      >
        <AvatarImage src={user?.imageUrl} alt={user?.name} />
        <AvatarFallback className="capitalize bg-[#18181c] font-bold text-neutral-200">
          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium text-neutral-300 truncate max-w-[140px]">
        {user ? user.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
