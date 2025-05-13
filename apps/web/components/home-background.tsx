import { AnimatedGridPattern } from "./magicui/animated-grid-pattern";
import type { ReactNode } from "react";

interface HomeBackgroundProps {
  children?: ReactNode;
}

export default function HomeBackground({ children }: HomeBackgroundProps) {
  return (
    <div className="relative min-w-full min-h-screen w-screen h-screen overflow-x-none overflow-y-auto">
      <AnimatedGridPattern
        numSquares={90}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
      />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
