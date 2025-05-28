import Image from "next/image";
import { AuroraText } from "./magicui/aurora-text";
import { TypingAnimation } from "./magicui/typing-animation";
import {
  SiGithub as GitHub,
  SiInstagram as Instagram,
  SiX as X,
} from "react-icons/si";

export default function Intro() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-5 gap-4 w-full h-full">
      {/* Text Content - Order 2 on sm, Order 1 (implicit by DOM) on md+ */}
      <div className="order-2 md:order-none md:col-span-3 flex flex-col h-full p-2">
        {/* Top Content */}
        <div className="flex flex-col gap-2">
          <h1 className="font-bold tracking-tighter text-2xl md:text-3xl lg:text-4xl">
            I'm <AuroraText colors={["#FF00AA", "#00FFF1"]}>Laxman</AuroraText>{" "}
            aka{" "}
            <AuroraText colors={["#FF00AA", "#00FFF1"]}>thaletto</AuroraText>.
          </h1>

          <TypingAnimation
            duration={70}
            delay={200}
            startOnView={true}
            className="font-mono text-sm md:text-xl lg:text-2xl"
          >
            A full stack AI developer, part time cinephile.
          </TypingAnimation>
        </div>

        {/* Spacer - only for md and larger devices */}
        <div className="flex-grow" />

        {/* Bottom Icons */}
        <div className="flex flex-row gap-4 items-center mt-4 md:mt-0">
          <a
            href="https://github.com/thaletto"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <GitHub size={28} className="hover:opacity-80 transition-opacity" />
          </a>
          <a
            href="https://instagram.com/thaletto"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram profile"
          >
            <Instagram
              size={28}
              className="hover:opacity-80 transition-opacity"
            />
          </a>
          <a
            href="https://x.com/thaletto"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (formerly Twitter) profile"
          >
            <X size={28} className="hover:opacity-80 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Image Content - Order 1 on sm, Order 2 (implicit by DOM) on md+ */}
      <div className="order-1 md:order-none md:col-span-2 relative h-64 sm:h-80 md:h-full w-full bg-black rounded-xl overflow-hidden">
        <Image
          src="/ascii-profile.png"
          alt="Laxman aka thaletto"
          className="object-cover rounded-2xl"
          fill
        />
      </div>
    </div>
  );
}