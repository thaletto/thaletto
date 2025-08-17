import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const BADGE_COLORS: Record<number, string> = {
  2: 'bg-[#F9BFA7]',
  3: 'bg-[#E1E4E4]',
  4: 'bg-[#FAE57E]',
};

type AchievementLevel = 0 | 1 | 2 | 3 | 4;

interface Achievement {
  name: string;
  description: string;
  src: string;
  maxLevel?: AchievementLevel; // if provided, caps max
}

const ACHIEVEMENTS = {
  starStruck: {
    name: 'Starstruck',
    description: 'Created a repository that has many stars',
    src: 'https://github.githubassets.com/assets/starstruck-default-b6610abad518.png',
  },
  quickDraw: {
    name: 'Quickdraw',
    description: 'Closed an issue or pull request within 5 minutes',
    src: 'https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png',
    maxLevel: 1,
  },
  pairExtraordinaire: {
    name: 'Pair Extraordinaire',
    description: 'Collaborated with others effectively',
    src: 'https://github.githubassets.com/assets/pair-extraordinaire-default-579438a20e01.png',
  },
  pullShark: {
    name: 'Pull Shark',
    description: 'Opened pull requests that have been merged',
    src: 'https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png',
  },
  galaxyBrain: {
    name: 'Galaxy Brain',
    description: 'Answered a discussion (got an accepted answer)',
    src: 'https://github.githubassets.com/assets/galaxy-brain-default-847262c21056.png',
  },
  yolo: {
    name: 'YOLO',
    description: 'Merged a pull request without a review',
    src: 'https://github.githubassets.com/assets/yolo-default-be0bbff04951.png',
    maxLevel: 1,
  },
} as const;

type AchievementKey = keyof typeof ACHIEVEMENTS;

type AchievementLevels = {
  [K in AchievementKey]: (typeof ACHIEVEMENTS)[K] extends { maxLevel: 1 }
    ? 0 | 1
    : AchievementLevel;
};

interface GitHubAchievementsProps extends Partial<AchievementLevels> {
  className?: string;
}

interface AchievementBadgeProps {
  name: string;
  src: string;
  level: number;
  description: string;
  className?: string;
}

function AchievementBadge({
  name,
  src,
  level,
  description,
  className,
}: AchievementBadgeProps) {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div className="h-16 w-16 overflow-hidden rounded-full">
        <Tooltip>
          <TooltipTrigger>
            <img src={src} alt={name} className="h-full w-full object-cover" />
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      </div>
      {level >= 2 && (
        <div
          className={cn(
            'absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white',
            BADGE_COLORS[level] || ''
          )}
        >
          x{level}
        </div>
      )}
    </div>
  );
}

export function GitHubAchievements({
  className,
  ...props
}: GitHubAchievementsProps) {
  const activeAchievements = (Object.keys(ACHIEVEMENTS) as AchievementKey[])
    .map((key) => {
      const level = props[key] ?? 0;
      return { key, level, ...ACHIEVEMENTS[key] };
    })
    .filter((a) => a.level > 0);

  if (activeAchievements.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {activeAchievements.map((a) => (
        <AchievementBadge
          key={a.key}
          name={a.name}
          src={a.src}
          level={a.level}
          description={a.description}
        />
      ))}
    </div>
  );
}
