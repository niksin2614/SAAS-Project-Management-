// components/ProjectList.jsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/organizations";
import DeleteProject from "./delete-project";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ProjectList({ orgId }) {
  const projects = await getProjects(orgId);

  if (projects.length === 0) {
    return (
      <Card className="bg-slate-900/60 border-dashed border-slate-700 p-8 text-center">
        <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
          <p className="text-gray-400 text-lg">
            No projects in this organization yet.
          </p>
          <Link href="/project/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={18} />
              Create Your First Project
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {project.name}
              <DeleteProject projectId={project.id} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{project.description}</p>
            <Link
              href={`/project/${project.id}`}
              className="text-blue-500 hover:underline"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
