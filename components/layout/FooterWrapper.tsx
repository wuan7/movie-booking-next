"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FooterWrapper = () => {
  const pathname = usePathname();
  const noHeaderPaths = ["/admin"];
  if (noHeaderPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <>
      <Footer />
    </>
  )
};

export default FooterWrapper;