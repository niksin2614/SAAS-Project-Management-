"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, differenceInDays } from "date-fns";

import { useOrganization } from "@clerk/nextjs";
import { sprintSchema } from "@/app/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprints";
import ChatWidget from "@/components/chat-widget";
import OrgInviteButton from "@/components/org-invite-button";

export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
  orgId,
}) {
  const [showForm, setShowForm] = useState(false);
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn, error: createSprintError } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const setPresetDuration = (days, fieldChange) => {
    const from = dateRange?.from || new Date();
    const to = addDays(from, days);
    const newRange = { from, to };
    setDateRange(newRange);
    if (fieldChange) fieldChange(newRange);
    setValue("startDate", from);
    setValue("endDate", to);
  };

  const onSubmit = async (data) => {
    await createSprintFn(projectId, {
      ...data,
      name: data.name || `${projectKey}-${sprintKey}`,
      startDate: dateRange.from || new Date(),
      endDate: dateRange.to || addDays(new Date(), 14),
    });
    setShowForm(false);
    router.refresh(); // Refresh the page to show updated data
  };

  const daysCount =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 14;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-neutral-300">
              {projectKey}
            </span>
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
              Sprint Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {projectTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {orgId && (
            <>
              <OrgInviteButton orgId={orgId} orgName={projectTitle} />
              <ChatWidget orgId={orgId} orgName={projectTitle} buttonVariant="button" />
            </>
          )}
          {isAdmin && (
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className={`h-8 sm:h-9 text-xs sm:text-sm px-3.5 rounded-lg shadow-sm font-semibold transition-all flex items-center gap-1.5 ${
                !showForm
                  ? "bg-white hover:bg-neutral-200 text-black"
                  : "bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10"
              }`}
            >
              {!showForm ? (
                <>
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Create Sprint</span>
                </>
              ) : (
                <>
                  <X size={15} />
                  <span>Cancel</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <Card className="mb-6 bg-[#09090c] border border-white/[0.12] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in duration-200">
          <CardContent className="p-4 sm:p-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row gap-3.5 items-end"
            >
              <div className="flex-1 w-full">
                <label
                  htmlFor="name"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-[#050507] border-white/[0.12] text-neutral-200 font-mono font-semibold h-10 text-xs sm:text-sm rounded-xl shadow-inner"
                />
                {errors.name && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex-1 w-full">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-10 justify-between text-left font-medium bg-[#050507] border-white/[0.12] text-neutral-200 hover:bg-[#101014] hover:text-white rounded-xl shadow-inner px-3.5 text-xs sm:text-sm transition-all"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CalendarIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            {dateRange?.from && dateRange?.to ? (
                              <span className="text-xs sm:text-sm font-mono">
                                {format(dateRange.from, "MMM d")} &rarr;{" "}
                                {format(dateRange.to, "MMM d, yyyy")}
                              </span>
                            ) : (
                              <span className="text-neutral-500 text-xs">Pick sprint dates</span>
                            )}
                          </div>
                          {daysCount > 0 && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-neutral-200 ml-1.5 shrink-0 border border-white/[0.1]">
                              {daysCount} {daysCount === 1 ? "day" : "days"}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-[#09090c] border border-white/[0.14] shadow-[0_16px_50px_rgba(0,0,0,0.95)] rounded-2xl overflow-hidden"
                        align="start"
                      >
                        {/* Quick Duration Presets */}
                        <div className="p-3 border-b border-white/[0.08] bg-black/60">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-neutral-300" />
                              Duration Presets
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { label: "1 Week", days: 7 },
                              { label: "2 Weeks", days: 14 },
                              { label: "3 Weeks", days: 21 },
                              { label: "4 Weeks", days: 28 },
                            ].map((preset) => (
                              <button
                                key={preset.days}
                                type="button"
                                onClick={() => setPresetDuration(preset.days, field.onChange)}
                                className={`text-xs py-1.5 px-2 rounded-lg font-mono transition-all ${
                                  daysCount === preset.days
                                    ? "bg-white text-black font-bold shadow-sm"
                                    : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/[0.08]"
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Calendar */}
                        <Calendar
                          mode="range"
                          disabled={[{ before: new Date() }]}
                          selected={dateRange}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDateRange(range);
                              field.onChange(range);
                              setValue("startDate", range.from);
                              setValue("endDate", range.to);
                            } else if (range?.from) {
                              setDateRange(range);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {createSprintError && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{createSprintError.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={createSprintLoading}
                className="h-10 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0 disabled:opacity-40"
              >
                {createSprintLoading ? "Creating..." : "Save Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
