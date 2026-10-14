"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { deleteProject } from "@/actions/projects";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";

export default function DeleteProject({ projectId }) {
  const { membership } = useOrganization();
  const router = useRouter();

  const {
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
    data: deleted,
  } = useFetch(deleteProject);

  const isAdmin = membership?.role === "org:admin";

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This will remove all associated sprints and issues.")) {
      deleteProjectFn(projectId);
    }
  };

  useEffect(() => {
    if (deleted) {
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  if (!isAdmin) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ${
          isDeleting ? "animate-pulse opacity-50" : ""
        }`}
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete project"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </Button>
      {error && <p className="text-rose-400 text-xs mt-1">{error.message}</p>}
    </>
  );
}
