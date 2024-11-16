"use client";

import { type ClassValue, clsx } from "clsx";
import type { NextPage } from "next";
import { twMerge } from "tailwind-merge";
import { SwapCard } from "~~/components/SwapCard";
import { DynamicConnect } from "~~/components/scaffold-eth/ConnectButton";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Home: NextPage = () => {
  return (
    <>
      <div className=" max-h-[100vh] w-full overflow-hidden bg-gradient-to-br from-[#1a2e35] via-[#1e3c64] to-[#4a3b59]">
        <div className="lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2">
          <h1
            className={cn(
              "pl-5 pt-5 text-3xl font-normal leading-tight tracking-tight text-white sm:text-7xl md:text-5xl",
            )}
          >
            stFlow
            <br />
            {/* Embracing capital */}
            {/* <br /> */}
            {/* mobility */}
          </h1>
          <div className="pt-5">
            <DynamicConnect />
          </div>
        </div>
        {/* Noise overlay */}
        <div
          className=" inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />

        {/* Content container */}
        <div className="pt-6 relative z-10 flex flex-col items-center justify-start min-h-screen px-6 sm:px-8">
          {/* Centered SwapCard */}
          <div className="flex items-center justify-center w-full max-w-md">
            <SwapCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
