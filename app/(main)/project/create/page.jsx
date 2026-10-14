"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/app/lib/validators";
import { createProject } from "@/actions/projects";
import { BarLoader } from "react-spinners";
import OrgSwitcher from "@/components/org-switcher";
import { FolderPlus, ShieldAlert, ArrowRight } from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();
  const { organization, isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded) {
      if (membership) {
        setIsAdmin(membership.role === "org:admin");
      } else if (organization) {
        setIsAdmin(true);
      }
    }
  }, [isOrgLoaded, isUserLoaded, membership, organization]);

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch(createProject);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    createProjectFn({ ...data, orgId: organization?.id });
  };

  useEffect(() => {
    if (project) {
      router.push(`/project/${project.id}`);
    }
  }, [project, router]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-md text-center">
        <div className="bg-[#09090c] border border-white/[0.1] p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-rose-400 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Access Required</h2>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Only workspace administrators have permissions to create new projects in this organization.
          </p>
          <OrgSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-lg">
      <div className="text-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white mx-auto mb-2.5 shadow-md">
          <FolderPlus className="w-5 h-5 text-neutral-200" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create New Project
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Initialize a new sprint board for {organization?.name || "your organization"}.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 bg-[#09090c] p-6 sm:p-7 rounded-2xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
          >
            Project Name
          </label>
          <Input
            id="name"
            {...register("name")}
            className="bg-[#050507] border-white/[0.12] focus-visible:border-white/50 h-10 text-xs sm:text-sm rounded-xl text-white placeholder:text-neutral-600 shadow-inner"
            placeholder="e.g. NextGen Core Platform"
          />
          {errors.name && (
            <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="key"
            className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
          >
            Project Key <span className="text-neutral-500 font-normal">(Prefix for issue tickets)</span>
          </label>
          <Input
            id="key"
            {...register("key")}
            className="bg-[#050507] border-white/[0.12] focus-visible:border-white/50 h-10 text-xs sm:text-sm font-mono uppercase rounded-xl text-white placeholder:text-neutral-600 shadow-inner"
            placeholder="e.g. CORE"
            maxLength={10}
          />
          {errors.key && (
            <p className="text-rose-400 text-xs mt-1">{errors.key.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
          >
            Project Description
          </label>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-[#050507] border-white/[0.12] focus-visible:border-white/50 h-24 text-xs sm:text-sm rounded-xl text-white placeholder:text-neutral-600 shadow-inner resize-none"
            placeholder="Describe project objectives and deliverables..."
          />
          {errors.description && (
            <p className="text-rose-400 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {loading && (
          <div className="py-1">
            <BarLoader width={"100%"} color="#ffffff" />
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all mt-2 disabled:opacity-40"
        >
          {loading ? "Creating Project..." : (
            <>
              <span>Create Project</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        {error && <p className="text-rose-400 text-xs mt-1">{error.message}</p>}
      </form>
    </div>
  );
}
