"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { BarLoader } from "react-spinners";
import { formatDistanceToNow, isAfter, isBefore, format } from "date-fns";

import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { updateSprintStatus } from "@/actions/sprints";

export default function SprintManager({
  sprint,
  setSprint,
  sprints,
  projectId,
}) {
  const [status, setStatus] = useState(sprint.status);
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    fn: updateStatus,
    loading,
    error,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const handleStatusChange = async (newStatus) => {
    updateStatus(sprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }
  }, [searchParams, sprints]);

  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
    router.replace(`/project/${projectId}`, undefined, { shallow: true });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 h-12 text-base font-medium px-4 w-full sm:w-auto min-w-[340px]">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
            {sprints.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id} className="text-base py-2.5">
                <span className="font-semibold">{sprint.name}</span>{" "}
                <span className="text-slate-400 text-sm">
                  ({format(sprint.startDate, "MMM d, yyyy")} to {format(sprint.endDate, "MMM d, yyyy")})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3">
          {isAdmin && canStart && (
            <Button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-6 text-base shadow-lg shadow-emerald-600/20"
            >
              Start Sprint
            </Button>
          )}
          {isAdmin && canEnd && (
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={loading}
              variant="destructive"
              className="font-bold h-12 px-6 text-base shadow-lg shadow-red-600/20"
            >
              End Sprint
            </Button>
          )}
        </div>
      </div>

      {loading && <BarLoader width={"100%"} className="mt-2" color="#3b82f6" />}
      {getStatusText() && (
        <Badge variant="outline" className="mt-3 text-sm px-3 py-1 font-semibold border-slate-700 bg-slate-900 text-slate-200 self-start">
          {getStatusText()}
        </Badge>
      )}
    </>
  );
}
