import { GitHubAchievements } from './github-achievements';
import { RainbowButton } from './magicui/rainbow-button';
import { MessageCircle } from 'lucide-react';

export function About() {
  return (
    <div className="flex-1">
      <p className="text-zinc-600 dark:text-zinc-300">
        Focused on creating intuitive and performant web experiences. Bridging
        the gap between design and development.
      </p>
      <p className="mt-4 text-zinc-600 italic dark:text-zinc-300">
        Do not go gentle into that good night.
        <br />
        Rage, rage against the dying of the light
      </p>
      <GitHubAchievements className='mt-4' pairExtraordinaire={1} yolo={1} pullShark={2} quickDraw={1}/>
      <div className="mt-4">
        <RainbowButton className='rounded-xl' size='default' asChild>
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
