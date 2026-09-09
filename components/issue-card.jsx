"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params) => {
    router.refresh();
    onUpdate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg hover:border-slate-700 transition-all bg-slate-950/90 border-slate-800/90 rounded-lg overflow-hidden"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} p-3 pb-1.5`}
        >
          <CardTitle className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
            {issue.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-1.5 p-3 pt-0 pb-1.5">
          {showStatus && <Badge className="text-[10px] font-semibold px-2 py-0.2">{issue.status}</Badge>}
          <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.2 border-slate-800 text-slate-300 bg-slate-900/60">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-1.5 p-3 pt-1.5 border-t border-slate-900/80">
          <UserAvatar user={issue.assignee} size="sm" />

          <div className="text-[11px] font-normal text-slate-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
}
