import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import SprintCreationForm from "../_components/create-sprint";
import SprintBoard from "../_components/sprint-board";
import ChatWidget from "@/components/chat-widget";
import { Layers } from "lucide-react";

export default async function ProjectPage({ params }) {
  const { projectId } = params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-20 relative">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
        orgId={project.organizationId}
      />

      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div className="mt-8 p-12 text-center bg-[#09090c] border border-dashed border-white/15 rounded-2xl shadow-sm max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-neutral-400 mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No Active Sprints
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Click &ldquo;Create Sprint&rdquo; above to establish a sprint timeframe and begin planning and tracking issues on the Kanban board.
          </p>
        </div>
      )}

      {/* Floating Team Chat Widget */}
      <ChatWidget orgId={project.organizationId} orgName={project.name} />
    </div>
  );
}
