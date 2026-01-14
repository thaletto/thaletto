import { createFileRoute } from "@tanstack/react-router";
import { allProjects } from ".content-collections/generated";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/projects")({
  component: Projects,
});

function Projects() {
  const [open, setOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<
    (typeof allProjects)[0] | null
  >(null);
  const isDesktop = !useIsMobile();

  const ProjectDetails = () => (
    <>
      {selectedProject && (
        <>
          <img
            src={selectedProject.image}
            alt={selectedProject.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <DialogTitle>{selectedProject.title}</DialogTitle>
          <DialogDescription>{selectedProject.summary}</DialogDescription>
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: selectedProject.content }}
          />
          {selectedProject.link && (
            <a
              href={selectedProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 block"
            >
              View Project
            </a>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allProjects.map((project) => (
          <div
            key={project.title}
            className="border p-4 rounded-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedProject(project);
              setOpen(true);
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h4 className="font-semibold">{project.title}</h4>
            <p className="text-sm text-gray-600">{project.summary}</p>
          </div>
        ))}
      </div>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <ProjectDetails />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <ProjectDetails />
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
