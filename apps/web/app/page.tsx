import HomeBackground from "@/components/home-background";
import Intro from "@/components/Intro";
import ShineCard from "@/components/shine-card";
import Skills from "@/components/skills";

export default function Home() {
  return (
    <div className="container overflow-x-none">
      <HomeBackground>
        <div className="min-h-screen w-full flex items-center justify-center">
          <ShineCard>
            <Intro />
          </ShineCard>
        </div>

        <ShineCard>
          <Skills />
        </ShineCard>
      </HomeBackground>
    </div>
  );
}
