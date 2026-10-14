import { Suspense } from "react";
import { getUserIssues } from "@/actions/organizations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/issue-card";
import { UserCheck } from "lucide-react";

export default async function UserIssues({ userId, orgId }) {
  const issues = await getUserIssues(userId, orgId);

  if (!issues || issues.length === 0) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue) => issue.assignee?.clerkUserId === userId
  );
  const reportedIssues = issues.filter(
    (issue) => issue.reporter?.clerkUserId === userId
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-neutral-400" />
            My Issues
          </h2>
          <p className="text-xs text-neutral-400">
            Quickly monitor tasks assigned to you or opened by you across all sprints.
          </p>
        </div>
      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="bg-[#08080a] border border-white/[0.1] p-1 h-9 rounded-xl mb-4">
          <TabsTrigger
            value="assigned"
            className="text-xs font-semibold px-3 py-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-neutral-400 transition-all flex items-center gap-1.5"
          >
            <span>Assigned to You</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/[0.1] font-mono">
              {assignedIssues.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reported"
            className="text-xs font-semibold px-3 py-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-neutral-400 transition-all flex items-center gap-1.5"
          >
            <span>Reported by You</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/[0.1] font-mono">
              {reportedIssues.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-0">
          <Suspense fallback={<IssueGridSkeleton />}>
            {assignedIssues.length > 0 ? (
              <IssueGrid issues={assignedIssues} />
            ) : (
              <div className="p-8 text-center bg-[#08080a] border border-white/[0.08] rounded-xl text-xs text-neutral-400">
                You currently have no issues assigned in this organization.
              </div>
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="reported" className="mt-0">
          <Suspense fallback={<IssueGridSkeleton />}>
            {reportedIssues.length > 0 ? (
              <IssueGrid issues={reportedIssues} />
            ) : (
              <div className="p-8 text-center bg-[#08080a] border border-white/[0.08] rounded-xl text-xs text-neutral-400">
                You have not reported any issues yet.
              </div>
            )}
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IssueGrid({ issues }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}

function IssueGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-28 rounded-xl bg-[#09090c] border border-white/[0.08] animate-pulse"
        />
      ))}
    </div>
  );
}
