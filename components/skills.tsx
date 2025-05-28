"use client";

import { useRef, useEffect } from "react";
import { Confetti, type ConfettiRef } from "./magicui/confetti";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  SiTypescript as Typescript,
  SiJavascript as Javascript,
  SiReact as React,
  SiNextdotjs as Nextjs,
  SiGit as Git,
  SiJenkins as Jenkins,
  SiFastapi as FastAPI,
  SiFlask as Flask,
  SiPython as Python,
  SiNodedotjs as Node,
  SiLangchain as Langchain,
  SiGrafana as Grafana,
  SiPandas as Pandas,
  SiJetpackcompose as Jetpackcompose,
  SiAndroidstudio as Androidstudio,
  SiDocker as Docker,
  SiPostgresql as Postgresql,
  SiMongodb as Mongodb,
  SiNeo4J as Neo4j,
  SiSqlite as Sqlite,
  SiMysql as Mysql,
} from "react-icons/si";

export default function Skills() {
  const confettiRef = useRef<ConfettiRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && confettiRef.current) {
            confettiRef.current.fire();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the component is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const skills = [
    { icon: Typescript, name: "TypeScript", color: "text-[#3178C6]" },
    { icon: Javascript, name: "JavaScript", color: "text-[#F7DF1E]" },
    { icon: React, name: "React", color: "text-[#61DAFB]" },
    { icon: Nextjs, name: "Next.js", color: "text-black dark:text-white" },
    { icon: Python, name: "Python", color: "text-[#3776AB]" },
    { icon: FastAPI, name: "FastAPI", color: "text-[#009688]" },
    { icon: Flask, name: "Flask", color: "text-black dark:text-white" },
    { icon: Node, name: "Node.js", color: "text-[#339933]" },
    { icon: Git, name: "Git", color: "text-[#F05032]" },
    { icon: Jenkins, name: "Jenkins", color: "text-[#D24939]" },
    { icon: Langchain, name: "LangChain", color: "text-[#F7B500]" },
    { icon: Grafana, name: "Grafana", color: "text-[#F46800]" },
    { icon: Pandas, name: "Pandas", color: "text-[#150458]" },
    { icon: Jetpackcompose, name: "Jetpack Compose", color: "text-[#4285F4]" },
    { icon: Androidstudio, name: "Android Studio", color: "text-[#3DDC84]" },
    { icon: Docker, name: "Docker", color: "text-[#2496ED]" },
    { icon: Postgresql, name: "PostgreSQL", color: "text-[#336791]" },
    { icon: Mongodb, name: "MongoDB", color: "text-[#47A248]" },
    { icon: Neo4j, name: "Neo4j", color: "text-[#018BFF]" },
    { icon: Sqlite, name: "SQLite", color: "text-[#003B57]" },
    { icon: Mysql, name: "MySQL", color: "text-[#4479A1]" },
  ];

  return (
    <div ref={containerRef} className="relative flex flex-col">
      <span className="pointer-events-none font-semibold text-lg md:text-xl lg:text-2xl leading-none">
        Skills
      </span>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
      />

      <TooltipProvider>
        <div className="mt-4 flex flex-wrap gap-4">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 hover:border-primary"
                  >
                    <Icon className={`size-8 ${skill.color}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{skill.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
