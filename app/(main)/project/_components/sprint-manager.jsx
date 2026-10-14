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

import { BarLoader } from "react-spinners";
import { formatDistanceToNow, isAfter, isBefore, format } from "date-fns";

import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { updateSprintStatus } from "@/actions/sprints";
import { Play, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedStatus, loading]);

  const getStatusInfo = () => {
    if (status === "COMPLETED") {
      return {
        text: "Sprint Ended",
        icon: CheckCircle2,
        badgeClass: "bg-white/[0.06] border-white/10 text-neutral-400",
      };
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return {
        text: `Overdue by ${formatDistanceToNow(endDate)}`,
        icon: AlertTriangle,
        badgeClass: "bg-rose-500/10 border-rose-500/30 text-rose-300",
      };
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return {
        text: `Starts in ${formatDistanceToNow(startDate)}`,
        icon: Clock,
        badgeClass: "bg-white/[0.04] border-white/10 text-neutral-400",
      };
    }
    if (status === "ACTIVE") {
      return {
        text: `Active • Ends in ${formatDistanceToNow(endDate)}`,
        icon: Play,
        badgeClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sprints]);

  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
    router.replace(`/project/${projectId}`, undefined, { shallow: true });
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-[#0b0b0e] border-white/[0.12] text-neutral-100 h-10 text-xs sm:text-sm font-medium px-3.5 w-full sm:w-auto min-w-[280px] rounded-xl shadow-sm">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent className="bg-[#0c0c0e] border border-white/10 text-neutral-100 shadow-xl">
            {sprints.map((spr) => (
              <SelectItem key={spr.id} value={spr.id} className="text-xs sm:text-sm py-2">
                <span className="font-semibold text-white">{spr.name}</span>{" "}
                <span className="text-neutral-500 text-xs font-mono">
                  ({format(spr.startDate, "MMM d")} - {format(spr.endDate, "MMM d, yyyy")})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          {isAdmin && canStart && (
            <Button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={loading}
              size="sm"
              className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold h-10 px-4 text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Sprint</span>
            </Button>
          )}
          {isAdmin && canEnd && (
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={loading}
              size="sm"
              className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold h-10 px-4 text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Sprint</span>
            </Button>
          )}
        </div>
      </div>

      {loading && <BarLoader width={"100%"} className="mt-2" color="#ffffff" />}

      {statusInfo && (
        <div className="mt-2.5 self-start">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border ${statusInfo.badgeClass}`}
          >
            <statusInfo.icon className="w-3 h-3" />
            <span>{statusInfo.text}</span>
          </span>
        </div>
      )}
    </>
  );
}
