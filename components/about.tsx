import { GitHubAchievements } from "./github-achievements";
import { RainbowButton } from "./magicui/rainbow-button";
import { MessageCircle } from "lucide-react";
import { TextEffect } from "./magicui/text-effect";

export function About() {
  return (
    <div className="flex-1">
      <div className="flex flex-col text-zinc-600">
        <TextEffect
          as="text"
          preset="fade"
          per="char"
          delay={0.5}
        >
        Focused on creating intuitive and performant web experiences.
        </TextEffect>
        <TextEffect
          as="text"
          preset="fade"
          per="char"
          delay={0.5}
        >
        Bridging the gap between design and development.
        </TextEffect>
      </div>
      <div className="flex flex-col mt-4 text-zinc-600 italic">
        <TextEffect
          as="text"
          preset="fade"
          per="char"
          delay={0.5}
        >
          Do not go gentle into that good night.
        </TextEffect>
        <TextEffect
          as="text"
          preset="fade"
          per="char"
          delay={0.5}
        >
          Rage, rage against the dying of the light
        </TextEffect>
      </div>
      <GitHubAchievements
        className="mt-4"
        pairExtraordinaire={1}
        yolo={1}
        pullShark={2}
        quickDraw={1}
      />
      <div className="mt-4">
        <RainbowButton className="rounded-xl" size="default" asChild>
          <a
            href="https://twitter.com/messages/compose?recipient_id=1826558389452771328"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with me
          </a>
        </RainbowButton>
      </div>
    </div>
  );
}
