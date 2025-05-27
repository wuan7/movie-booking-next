"use client";
import { useEffect, useState } from "react";
import SeatMap from "./modals/SeatMap";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import Trailer from "./modals/Trailer";
import CreateShowtime from "./modals/CreateShowtime";

const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateShowtime />
      <Trailer />
      <SignIn />
      <SignUp />
      <SeatMap />
    </>
  );
};

export default Modals;
