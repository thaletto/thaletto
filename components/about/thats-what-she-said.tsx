"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import thatswhatshesaid from "@/public/thats-what-she-said.gif";

export default function ThatsWhatSheSaid() {
  const isMobile = useIsMobile();

  const Trigger = (
    <span className="font-serif underline cursor-pointer">
      that's what she said
    </span>
  );

  const Content = (
    <Image
      src={thatswhatshesaid}
      alt="that's what she said"
      className="rounded-lg"
      unoptimized
      priority
    />
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger>{Trigger}</PopoverTrigger>
        <PopoverContent side="right" sideOffset={8} className="p-0 max-w-50">
          {Content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger>{Trigger}</HoverCardTrigger>
      <HoverCardContent side="right" sideOffset={8} className="p-0">
        {Content}
      </HoverCardContent>
    </HoverCard>
  );
}
