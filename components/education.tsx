import { Spotlight } from './magicui/spotlight';
import type { Education } from '@/types';

interface Props {
  EDUCATION: Education[];
}

export function Education({ EDUCATION }: Props) {
  return (
    <>
      <h3 className="mb-5 text-xl font-medium">Education</h3>
      <div className="flex flex-col space-y-2">
        {EDUCATION.map((edu) => (
          <div className="relative overflow-hidden py-1" key={edu.id}>
            <Spotlight
              className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl"
              size={64}
            />
            <div className="relative h-full w-full">
              <div className="relative flex w-full flex-col sm:flex-row sm:justify-between">
                <div>
                  <h4 className="font-normal">{edu.institution}</h4>
                  <p className="text-zinc-600">
                    {edu.degree}
                    <span className="hidden sm:inline">
                      {edu.cgpa && ` • CGPA: ${edu.cgpa}/10`}
                      {edu.marks && ` • Marks: ${edu.marks}%`}
                    </span>
                  </p>
                  {(edu.cgpa || edu.marks) && (
                    <p className="text-zinc-600 sm:hidden">
                      {edu.cgpa && `CGPA: ${edu.cgpa}/10`}
                      {edu.cgpa && edu.marks && ' • '}
                      {edu.marks && `Marks: ${edu.marks}%`}
                    </p>
                  )}
                </div>
                <p className="text-zinc-600">
                  {new Date(edu.start).toLocaleDateString('en-GB', {
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {typeof edu.end === 'string' && edu.end !== 'Present'
                    ? new Date(edu.end).toLocaleDateString('en-GB', {
                        year: 'numeric',
                      })
                    : edu.end}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
