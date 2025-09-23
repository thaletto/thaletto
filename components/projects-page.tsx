"use client";
import { useCallback, useMemo, useState, forwardRef } from "react";
import type { Project } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { ProjectCard } from "@/components/project";
import { motion } from "motion/react";
import {
  VARIANTS_SECTION,
  TRANSITION_SECTION,
} from "@/components/motion/constants";
import { RainbowButton } from "./magicui/rainbow-button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ProjectsPageProps {
  projects: Project[];
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

// Simplify text for comparisons: lowercase, remove spaces and non-alphanumerics
function simplify(text: string): string {
  return normalize(text).replace(/[^a-z0-9]+/g, "");
}

interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
}

const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, onRemove, variant, children, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant={variant}
        className={cn("rounded-full gap-1.5 pr-1.5", className)}
        {...props}
      >
        <span className="truncate">{children}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </Badge>
    );
  }
);

export default function ProjectsPage({ projects }: ProjectsPageProps) {
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const addChip = useCallback((raw: string) => {
    const value = normalize(raw);
    if (!value) return;
    setChips((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setQuery("");
    setPage(1);
  }, []);

  const removeChip = useCallback((value: string) => {
    setChips((prev) => prev.filter((c) => c !== value));
    setPage(1);
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addChip(query);
    },
    [addChip, query]
  );

  const filtered = useMemo(() => {
    if (chips.length === 0) return projects;
    return projects.filter((p) => {
      const simplifiedTags = p.tags.map((t) => simplify(t));
      const exactTagSet = new Set(simplifiedTags);
      return chips.every((chip) => {
        const simplifiedChip = simplify(chip);
        if (simplifiedChip.length >= 4) {
          // Allow partial match for chips of length >= 4
          return simplifiedTags.some((tag) => tag.includes(simplifiedChip));
        }
        // For shorter chips, require exact match
        return exactTagSet.has(simplifiedChip);
      });
    });
  }, [projects, chips]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <form onSubmit={onSubmit} className="flex items-center gap-2 w-full">
          <RainbowButton
            className="rounded-full py-6 w-full"
            size="default"
            asChild
          >
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                aria-hidden="true"
              />
              <Input
                className="pl-6 border-none shadow-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:border-none outline-none ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter skills or keywords"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChip(query);
                  }
                }}
                aria-label="Search projects by tag"
              />
            </div>
          </RainbowButton>
        </form>
      </motion.section>
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip
                key={c}
                variant="secondary"
                className="py-1"
                onRemove={() => removeChip(c)}
              >
                #{c}
              </Chip>
            ))}
          </div>
        )}
      </motion.section>
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} priority={false} />
          ))}
        </div>
      </motion.section>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          Showing {visible.length === 0 ? 0 : start + 1}-
          {start + visible.length} of {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="text-sm text-zinc-700">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
