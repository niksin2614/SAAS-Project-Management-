"use client";

import { UserButton } from "@clerk/nextjs";
import { LayoutGrid } from "lucide-react";

const UserMenu = () => {
  return (
    <div className="flex items-center">
      <UserButton
        appearance={{
          elements: {
            avatarBox:
              "w-8 h-8 sm:w-9 sm:h-9 ring-1 ring-white/15 hover:ring-white/30 transition-all rounded-full shadow-sm",
            userButtonPopoverCard:
              "bg-[#09090c] border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.95)] rounded-xl text-neutral-200",
            userButtonPopoverActionButton:
              "text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs font-medium",
            userButtonPopoverActionButtonText: "text-neutral-300 hover:text-white text-xs",
            userButtonPopoverFooter: "border-t border-white/10 bg-transparent",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            label="My Organizations"
            labelIcon={<LayoutGrid size={15} />}
            href="/onboarding"
          />
          <UserButton.Action label="manageAccount" />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
};

export default UserMenu;
