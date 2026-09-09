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
        className="cursor-pointer hover:shadow-xl hover:border-slate-700 transition-all bg-slate-950/90 border-slate-800"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={`border-t-4 ${priorityColor[issue.priority]} rounded-t-lg p-4 pb-2`}
        >
          <CardTitle className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
            {issue.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 p-4 pt-0">
          {showStatus && <Badge className="text-xs font-semibold px-2 py-0.5">{issue.status}</Badge>}
          <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-slate-700">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2.5 p-4 pt-1 border-t border-slate-900">
          <UserAvatar user={issue.assignee} size="md" />

          <div className="text-xs font-medium text-slate-400 w-full">Created {created}</div>
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
