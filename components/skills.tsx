import { SKILLS } from '@/lib/data'

export function Skills() {
  return (
    <>
      <h3 className="mb-5 text-xl font-medium">Skills</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {SKILLS.map((skill) => {
          return (
            <div
              key={skill.id}
              className="group relative overflow-hidden rounded-lg px-2 py-4"
            >
              <div className="relative flex items-center gap-2">
                {<skill.icon className='h-5 w-5'/>}
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {skill.name}
                </h4>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
