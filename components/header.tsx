"use client";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/magicui/text-effect";
import { TextMorph } from "@/components/magicui/text-morph";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

function CopyButton() {
  const [copied, setCopied] = useState(false);
  const [animate, setAnimate] = useState(false);
  const pathname = usePathname();
  const currentUrl =
    typeof window !== "undefined" ? window.location.origin + pathname : "";

  useEffect(() => {
    let timeoutId;
    if (copied) {
      setAnimate(true);
      const timeoutId = setTimeout(() => {
        setCopied(false);
        setAnimate(false);
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [copied]);

  return (
    <Button
      onClick={() => {
        setCopied(true);
        navigator.clipboard.writeText(currentUrl);
      }}
      variant="outline"
      className={`font-base flex cursor-pointer items-center gap-2 bg-transparent text-center text-sm text-zinc-500 transition-transform duration-200 ${animate ? "scale-110" : "scale-100"} ${copied && "text-green-500 hover:text-green-500"} `}
    >
      <span className="transition-all duration-300">
        {copied ? <Check /> : <Copy />}
      </span>
      <TextMorph>
        {copied ? "Copied URL" : "Copy URL"}
      </TextMorph>
    </Button>
  );
}

export function Header() {
  const pathname = usePathname();
  const showBackButton = pathname !== "/";
  const isBlogPage = pathname.startsWith("/blogs");

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window.document.startViewTransition === "function") {
      e.preventDefault();
      document.body.classList.add("slide-right");
      document
        .startViewTransition(() => {
          window.location.href = "/";
        })
        .finished.finally(() => {
          document.body.classList.remove("slide-right");
        });
    }
  };

  return (
    <header className="mb-8 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex flex-row gap-2">
          <Link
            href="https://github.com/thaletto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar className="size-16 transition-opacity hover:opacity-90">
              <AvatarImage src="https://github.com/thaletto.png" />
              <AvatarFallback className="bg-zinc-600 text-xl text-zinc-100">
                LKR
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col gap-1">
            <Link href="/" className="text-3xl font-medium">
              <TextEffect as="text" preset="fade" per="char" delay={0.5}>
                Laxman K R
              </TextEffect>
            </Link>

            <div className="text-zinc-600">
              <TextEffect as="text" preset="fade" per="char" delay={0.5}>
                @thaletto | Full Stack AI Developer
              </TextEffect>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-8">
        {showBackButton && (
          <Button
            asChild
            variant="ghost"
            className="mr-auto inline-flex items-center justify-center text-zinc-600 transition-colors hover:bg-transparent hover:text-zinc-900"
          >
            <Link href="/" onClick={handleBackClick}>
              <ArrowLeft className="h-5 w-5" /> Back
            </Link>
          </Button>
        )}
        {isBlogPage && <CopyButton />}
      </div>
    </header>
  );
}
