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
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-xl">
      <h1 className="text-2xl sm:text-3xl text-center font-extrabold mb-6 gradient-title">
        Create New Project
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-3.5 bg-slate-950/80 p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xl"
      >
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Project Name
          </label>
          <Input
            id="name"
            {...register("name")}
            className="bg-slate-900 border-slate-800 h-9 text-xs sm:text-sm rounded-lg"
            placeholder="e.g. Mobile App"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="key" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Project Key
          </label>
          <Input
            id="key"
            {...register("key")}
            className="bg-slate-900 border-slate-800 h-9 text-xs sm:text-sm rounded-lg"
            placeholder="e.g. MOB"
          />
          {errors.key && (
            <p className="text-red-500 text-xs mt-1">{errors.key.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Project Description
          </label>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-slate-900 border-slate-800 h-24 text-xs sm:text-sm rounded-lg"
            placeholder="Describe your project goals..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        {loading && (
          <BarLoader className="mb-2" width={"100%"} color="#3b82f6" />
        )}
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white h-9 text-xs sm:text-sm font-bold rounded-lg shadow-md mt-2"
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </form>
    </div>
  );
}
