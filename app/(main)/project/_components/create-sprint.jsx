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
import { Calendar as CalendarIcon, Clock, Sparkles } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold gradient-title tracking-tight">
          {projectTitle}
        </h1>
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
              variant={!showForm ? "default" : "destructive"}
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm px-3.5 rounded-lg shadow-sm font-semibold"
            >
              {!showForm ? "Create New Sprint" : "Cancel"}
            </Button>
          )}
        </div>
      </div>
      {showForm && (
        <Card className="pt-3 mb-5 bg-slate-950/80 border-slate-800 shadow-xl backdrop-blur-xl rounded-xl">
          <CardContent className="p-3 sm:p-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row gap-3 items-end"
            >
              <div className="flex-1 w-full">
                <label
                  htmlFor="name"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-slate-900/90 border-slate-800 text-slate-200 font-semibold h-9 text-xs sm:text-sm rounded-lg shadow-inner"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
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
                          className="w-full h-9 justify-between text-left font-medium bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800/90 hover:text-white rounded-lg shadow-inner px-3 text-xs sm:text-sm transition-all"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <CalendarIcon className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            {dateRange?.from && dateRange?.to ? (
                              <span className="text-xs sm:text-sm">
                                {format(dateRange.from, "MMM dd, yyyy")} &rarr;{" "}
                                {format(dateRange.to, "MMM dd, yyyy")}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">Pick sprint dates</span>
                            )}
                          </div>
                          {daysCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-950 border border-blue-800/60 text-blue-300 ml-1.5 shrink-0">
                              {daysCount} {daysCount === 1 ? "day" : "days"}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-slate-950/95 border border-indigo-500/20 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden"
                        align="start"
                      >
                        {/* Quick Duration Presets */}
                        <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-400" />
                              Quick Sprint Duration:
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
                                className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-all ${
                                  daysCount === preset.days
                                    ? "bg-blue-600 text-white shadow-sm font-bold"
                                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Modern Styled Calendar */}
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
                  <p className="text-red-500 text-xs mt-1 font-medium">{createSprintError.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={createSprintLoading}
                className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-95 transition-all"
              >
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
