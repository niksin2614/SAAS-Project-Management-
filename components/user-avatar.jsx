import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  return (
    <div className="flex items-center space-x-2.5">
      <Avatar className={`${sizeClasses[size] || sizeClasses.md} border border-slate-700 shadow-sm flex-shrink-0`}>
        <AvatarImage src={user?.imageUrl} alt={user?.name} />
        <AvatarFallback className="capitalize bg-slate-800 font-bold text-slate-200">
          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-slate-300 truncate">
        {user ? user.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
