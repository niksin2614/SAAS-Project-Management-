"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";

const UserLoading = () => {
  const { isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  if (!isOrgLoaded || !isUserLoaded) {
    return (
      <div className="w-full h-1 overflow-hidden bg-slate-900/60 rounded-full mb-3">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />
      </div>
    );
  }

  return null;
};

export default UserLoading;
