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
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-title pb-2">
            {organization.name}&rsquo;s Workspace
          </h1>
          <p className="text-slate-400 text-sm">
            Manage projects, track assigned sprint issues, and collaborate with your team in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <OrgInviteButton orgId={organization.id} orgName={organization.name} />
          <OrgSwitcher />
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1 mb-6">
          <TabsTrigger
            value="projects"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
          >
            <LayoutGrid className="w-4 h-4" />
            Projects & Issues
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            Team Hub Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-8 mt-0">
          <div>
            <ProjectList orgId={organization.id} />
          </div>
          <div>
            <UserIssues userId={userId} orgId={organization.id} />
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <OrgChat orgId={organization.id} orgName={organization.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
