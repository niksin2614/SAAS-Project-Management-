import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganization } from "@/actions/organizations";
import OrgSwitcher from "@/components/org-switcher";
import ProjectList from "./_components/project-list";
import UserIssues from "./_components/user-issues";
import OrgChat from "./_components/org-chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, MessageSquare } from "lucide-react";
import OrgInviteButton from "@/components/org-invite-button";

export default async function OrganizationPage({ params }) {
  const { orgId } = params;
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const organization = await getOrganization(orgId);

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Workspace Not Found</h2>
        <p className="text-neutral-400 text-sm">
          The requested organization could not be located.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-16">
      {/* Workspace Header */}
      <div className="mb-6 pb-6 border-b border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
              Organization Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {organization.name}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Manage projects, monitor sprint progression, and collaborate in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <OrgInviteButton orgId={organization.id} orgName={organization.name} />
          <OrgSwitcher />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="bg-[#08080a] border border-white/[0.1] p-1 mb-6 h-10 rounded-xl">
          <TabsTrigger
            value="projects"
            className="flex items-center gap-2 text-xs py-1.5 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm font-semibold text-neutral-400 transition-all"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Projects & Issues
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex items-center gap-2 text-xs py-1.5 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm font-semibold text-neutral-400 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Team Hub Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-10 mt-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Active Projects
              </h2>
            </div>
            <ProjectList orgId={organization.id} />
          </div>

          <div className="pt-6 border-t border-white/[0.08]">
            <UserIssues userId={userId} orgId={organization.id} />
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-0 flex justify-center w-full">
          <div className="w-full max-w-5xl h-[700px]">
            <OrgChat orgId={organization.id} orgName={organization.name} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
