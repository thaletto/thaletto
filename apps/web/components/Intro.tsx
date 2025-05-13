import { AuroraText } from "./magicui/aurora-text";
import { TypingAnimation } from "./magicui/typing-animation";

export default function Intro() {
  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-6xl">
        I'm <AuroraText>Laxman</AuroraText> aka{" "}
        <AuroraText>thaletto</AuroraText>.
      </h1>
      <div>
        <TypingAnimation duration={70} delay={200} startOnView={true} className="font-mono text-lg md:text-xl lg:text-2xl">
          A full(time) stack AI dev, part time moviebuff
        </TypingAnimation>
      </div>
    </div>
  );
}
