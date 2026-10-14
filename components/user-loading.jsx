"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";

const UserLoading = () => {
  const { isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  if (!isOrgLoaded || !isUserLoaded) {
    return (
      <div className="w-full h-[2px] overflow-hidden bg-white/[0.05] relative">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
    );
  }

  return null;
};

export default UserLoading;
