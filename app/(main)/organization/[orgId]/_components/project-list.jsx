import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/organizations";
import DeleteProject from "./delete-project";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, FolderGit2, Kanban } from "lucide-react";

export default async function ProjectList({ orgId }) {
  const projects = await getProjects(orgId);

  if (projects.length === 0) {
    return (
      <Card className="bg-[#08080a] border border-dashed border-white/15 p-10 text-center rounded-2xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-neutral-400">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-sm">
              Get started by creating your team&apos;s first agile project board.
            </p>
          </div>
          <Link href="/project/create">
            <Button className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm h-9 px-4 rounded-lg shadow-sm gap-1.5 transition-all">
              <Plus size={16} strokeWidth={2.5} />
              Create Project
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="bg-[#09090c] border border-white/[0.08] hover:border-white/[0.22] hover:bg-[#0d0d11] transition-all duration-200 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)] group flex flex-col justify-between"
        >
          <CardHeader className="p-5 pb-3">
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-neutral-300">
                    {project.key}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-white tracking-tight group-hover:text-white transition-colors">
                  {project.name}
                </CardTitle>
              </div>
              <DeleteProject projectId={project.id} />
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-0 space-y-4">
            <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
              {project.description || "No project description provided."}
            </p>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <Link
                href={`/project/${project.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors"
              >
                <Kanban className="w-3.5 h-3.5 text-neutral-400" />
                <span>Open Sprint Board</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
