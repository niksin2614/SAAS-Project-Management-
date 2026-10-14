import React from "react";
import Logo from "@/components/logo";
import Link from "next/link";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center py-12 px-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <Link href="/">
            <Logo size="lg" />
          </Link>
        </div>
        <div className="w-full flex justify-center">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
