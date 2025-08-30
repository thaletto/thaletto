import { SKILLS } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Certificate } from '@/types';
import { SiMeta, SiHuggingface } from 'react-icons/si';
import { FaUniversity } from 'react-icons/fa';

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
              {skill.icon ? (
                <skill.icon className="h-5 w-5 text-zinc-900" />
              ) : null}
              <h4 className="font-medium text-zinc-900">{skill.name}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  CERTIFICATES: Certificate[];
}

function Certificates({ CERTIFICATES }: Props) {
  return (
    <AnimatedBackground
      enableHover
      className="h-full w-full rounded-lg bg-zinc-50/40"
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
    >
      {[...CERTIFICATES]
        .sort(
          (a, b) =>
            new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
        )
        .map((certificate) => {
          let IconComponent;
          switch (certificate.icon) {
            case 'SiMeta':
              IconComponent = SiMeta;
              break;
            case 'SiHuggingface':
              IconComponent = SiHuggingface;
              break;
            default:
              IconComponent = FaUniversity;
          }
          return (
            <a
              key={certificate.id}
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-3 flex flex-row items-center justify-between rounded-xl px-3 py-3"
              data-id={certificate.id}
            >
              <div className="flex items-center gap-3">
                {IconComponent ? (
                  <IconComponent className="h-6 w-6 md:h-8 md:w-8" />
                ) : null}
                <div className="flex flex-col space-y-1">
                  <h4 className="font-normal">{certificate.name}</h4>
                  <p className="text-zinc-600">
                    Issued by {certificate.issuedBy}
                    {certificate.issuedDate && (
                      <span>
                        {` in ${new Date(
                          certificate.issuedDate
                        ).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                        })}`}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
    </AnimatedBackground>
  );
}

export function SkillsAndCertificate({ CERTIFICATES }: Props) {
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
          <Certificates CERTIFICATES={CERTIFICATES} />
        </TabsContent>
      </Tabs>
    </>
  );
}
