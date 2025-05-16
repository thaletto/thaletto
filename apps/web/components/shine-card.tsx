import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NeonGradientCard } from "./magicui/neon-gradient-card";

interface ShineCardProps {
  children: ReactNode;
  className?: string;
}

export default function ShineCard({ children, className }: ShineCardProps) {
  return (
    <NeonGradientCard
      className="max-w-[80%] max-h-[60%] flex items-center justify-center"
      borderRadius={20}
      borderSize={4}
    >
      <div
        className={cn(
          `
            pointer-events-none 
            z-10 
            h-full
            whitespace-pre-wrap 
            bg-gradient-to-br from-card-background from-35% to-card-background
            bg-clip-text 
            text-card-foreground
            leading-none 
            tracking-tighter
            dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]
            `,
          className
        )}
      >
        {children}
      </div>
    </NeonGradientCard>
  );
}
