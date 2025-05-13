import HomeBackground from "@/components/home-background";
import Intro from "@/components/Intro";

export default function Home() {
  return (
    <div className="container max-w-3xl">
      <HomeBackground>
        <Intro />
      </HomeBackground>   
    </div>
  );
}
