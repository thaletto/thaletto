import { AnimatedGridPattern } from "./magicui/animated-grid-pattern";
import type { ReactNode } from "react";

interface HomeBackgroundProps {
  children?: ReactNode;
}

export default function HomeBackground({ children }: HomeBackgroundProps) {
  return (
    // Main container covering the full screen
    <div className="relative min-w-full min-h-screen w-screen h-screen">
      {/* Background pattern - positioned absolutely to cover the container */}
      <AnimatedGridPattern
        numSquares={90}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0 z-0" // Position absolutely and ensure it's behind content
      />

      {/* Scrollable content area */}
      {/* This div now handles the scrolling */}
      <div className="relative w-full h-full flex flex-col items-center overflow-y-auto px-4 py-2">
        {/* Children will be rendered inside this scrollable div */}
        {children}
      </div>
    </div>
  );
}
