import { SKILLS } from '@/lib/data';

export function Skills() {
  return (
    <>
      <h3 className="mb-5 text-xl font-medium">Skills</h3>
      <div className="grid grid-cols-2 justify-between gap-8 md:grid-cols-4">
        {SKILLS.map((skill, index) => {
          return (
            <div
              key={skill.id}
              className={`group relative overflow-hidden rounded-lg ${
                index % 2 === 0 ? 'justify-self-start' : 'justify-self-end'
              } sm:${index % 3 === 0 ? 'justify-self-start' : index % 3 === 2 ? 'justify-self-end' : 'justify-self-center'} md:${index % 4 === 0 ? 'justify-self-start' : index % 4 === 3 ? 'justify-self-end' : 'justify-self-center'}`}
            >
              <div className="relative flex items-center p-1 gap-2">
                {<skill.icon className="h-5 w-5" />}
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50">{skill.name}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
