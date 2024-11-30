"use client";

import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto bg-gray-50">{children}</div>
    </div>
  );
};

export default Layout;
