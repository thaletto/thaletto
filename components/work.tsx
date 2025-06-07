import { WORK_EXPERIENCE } from '@/lib/data'
import { Spotlight } from './ui/spotlight'

export function WorkExperience() {
  return (
    <>
      <h3 className="mb-5 text-xl font-medium">Work Experience</h3>
      <div className="flex flex-col space-y-2">
        {WORK_EXPERIENCE.map((job) => (
          <div className="relative overflow-hidden py-1" key={job.id}>
            <Spotlight
              className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
              size={64}
            />
            <div className="relative h-full w-full">
              <div className="relative flex w-full flex-row justify-between">
                <div>
                  <h4 className="font-normal dark:text-zinc-100">
                    {job.title}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    {job.company}
                  </p>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {job.start.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {job.end instanceof Date
                    ? job.end.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : job.end}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
