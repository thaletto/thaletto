import HomeBackground from "@/components/home-background";
import Intro from "@/components/Intro";
import ShineCard from "@/components/shine-card";

export default function Home() {
  return (
    <div className="container">
      <HomeBackground>
        <ShineCard>
          <Intro />
        </ShineCard>
      </HomeBackground>   
    </div>
  );
}
