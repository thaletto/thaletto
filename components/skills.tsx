import { SKILLS, CERTIFICATES } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

function Skills() {
  return (
    <div className="mt-2 grid grid-cols-2 justify-between gap-8 md:grid-cols-4">
      {SKILLS.map((skill, index) => {
        return (
          <div
            key={skill.id}
            className={`group relative overflow-hidden rounded-lg ${
              index % 2 === 0 ? 'justify-self-start' : 'justify-self-end'
            } sm:${index % 3 === 0 ? 'justify-self-start' : index % 3 === 2 ? 'justify-self-end' : 'justify-self-center'} md:${index % 4 === 0 ? 'justify-self-start' : index % 4 === 3 ? 'justify-self-end' : 'justify-self-center'}`}
          >
            <div className="relative flex items-center gap-2 p-1">
              {
                <skill.icon className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
              }
              <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                {skill.name}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Certificates() {
  return (
    <AnimatedBackground
      enableHover
      className="h-full w-full rounded-lg bg-zinc-50/40 dark:bg-zinc-900/80"
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
    >
      {[...CERTIFICATES]
        .sort((a, b) => b.issuedDate.getTime() - a.issuedDate.getTime())
        .map((certificate) => (
          <a
            key={certificate.id}
            href={certificate.link}
            target="_blank"
            rel="noopener noreferrer"
            className="-mx-3 flex flex-row items-center justify-between rounded-xl px-3 py-3"
            data-id={certificate.id}
          >
            <div className="flex items-center gap-3">
              <certificate.icon className="h-6 w-6 md:h-8 md:w-8 dark:text-zinc-50" />
              <div className="flex flex-col space-y-1">
                <h4 className="font-normal dark:text-zinc-50">
                  {certificate.name}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Issued by {certificate.issuedBy}
                  {certificate.issuedDate && (
                    <span>
                      {` in ${certificate.issuedDate.toLocaleDateString(
                        'en-GB',
                        {
                          year: 'numeric',
                          month: 'short',
                        }
                      )}`}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </a>
        ))}
    </AnimatedBackground>
  );
}

export function SkillsAndCertificate() {
  return (
    <>
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid h-10 w-full grid-cols-2">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="skills">
          <Skills />
        </TabsContent>
        <TabsContent value="certificates">
          <Certificates />
        </TabsContent>
      </Tabs>
    </>
  );
}
