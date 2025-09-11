import { GitHubAchievements } from "./github-achievements";
import { RainbowButton } from "./magicui/rainbow-button";
import { FaXTwitter } from "react-icons/fa6";
import { TextEffect } from "./magicui/text-effect";
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInTrigger,
} from "@/components/ai-elements/open-in-chat";

export function About() {
  return (
    <div className="flex-1 mt-4">
      <div className="flex flex-col text-zinc-600">
        <TextEffect as="text" preset="fade" per="char" delay={0.5}>
          Focused on creating intuitive and performant web experiences.
        </TextEffect>
        <TextEffect as="text" preset="fade" per="char" delay={0.5}>
          Bridging the gap between design and development.
        </TextEffect>
      </div>
      <div className="flex flex-col mt-4 text-zinc-600 italic">
        <TextEffect as="text" preset="fade" per="char" delay={0.5}>
          Do not go gentle into that good night.
        </TextEffect>
        <TextEffect as="text" preset="fade" per="char" delay={0.5}>
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
      <div className="mt-4 flex flex-row gap-2">
        <RainbowButton className="rounded-xl" size="default" asChild>
          <a
            href="https://twitter.com/messages/compose?recipient_id=1826558389452771328"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center gap-2"
          >
            <FaXTwitter />
            Chat
          </a>
        </RainbowButton>
        <OpenIn query="Analyse Laxman K R aka @thaletto profile, his portfolio is https://thaletto.vercel.app">
          <RainbowButton asChild>
            <OpenInTrigger className="rounded-xl"/>
          </RainbowButton>
          <OpenInContent>
            <OpenInChatGPT />
            <OpenInClaude />
          </OpenInContent>
        </OpenIn>
      </div>
    </div>
  );
}
