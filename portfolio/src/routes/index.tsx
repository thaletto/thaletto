import { createFileRoute } from '@tanstack/react-router'
import { allAbouts } from '.content-collections/generated';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
    const about = allAbouts[0];
    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold">{about.name}</h1>
            <p className="text-xl text-gray-500">{about.bio}</p>
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: about.content }} />
        </div>
    )
}