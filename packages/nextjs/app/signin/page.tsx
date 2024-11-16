import { Inter } from "next/font/google";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SwapCard } from "~~/components/SwapCard";

const inter = Inter({ subsets: ["latin"] });

// Utility function for conditional class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Component() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#1a2e35] via-[#1e3c64] to-[#4a3b59]">
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 sm:px-8">
        <div className="absolute top-12 left-6 sm:left-8 max-w-3xl">
          <h1
            className={cn(
              "text-6xl font-normal leading-tight tracking-tight text-white sm:text-7xl md:text-5xl",
              inter.className,
            )}
          >
            stFlow
            <br />
            {/* Embracing capital */}
            {/* <br /> */}
            {/* mobility */}
          </h1>
        </div>

        {/* Centered SwapCard */}
        <div className="flex items-center justify-center w-full max-w-md">
          <SwapCard />
        </div>

        {/* Navigation */}
        <div className="absolute bottom-8 left-6 flex gap-4 text-sm text-white/60 sm:left-8">
          <span>Reviews</span>
          <span>/</span>
          <span>Mobile Strategy</span>
        </div>
      </div>
    </div>
  );
}
