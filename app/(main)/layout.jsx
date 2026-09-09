import React from "react";
import { checkUser } from "@/lib/checkUser";

const Layout = async ({ children }) => {
  await checkUser();
  return <div className="container mx-auto mt-5 px-4">{children}</div>;
};

export default Layout;
