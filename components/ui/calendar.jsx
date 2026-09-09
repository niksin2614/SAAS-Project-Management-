"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <div className="p-1 calendar-wrapper">
      <style jsx global>{`
        .calendar-wrapper .rdp-day {
          height: 38px;
          width: 38px;
          padding: 0;
          text-align: center;
        }
        .calendar-wrapper .rdp-day_button {
          height: 36px;
          width: 36px;
          border-radius: 10px;
          font-weight: 500;
          color: #cbd5e1;
          transition: all 0.15s ease;
        }
        .calendar-wrapper .rdp-day_button:hover {
          background-color: #1e293b;
          color: #ffffff;
        }
        .calendar-wrapper .rdp-range_start .rdp-day_button,
        .calendar-wrapper .rdp-range_start {
          background: linear-gradient(135deg, #2563eb, #4f46e5) !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          border-top-left-radius: 12px !important;
          border-bottom-left-radius: 12px !important;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
        .calendar-wrapper .rdp-range_end .rdp-day_button,
        .calendar-wrapper .rdp-range_end {
          background: linear-gradient(135deg, #4f46e5, #2563eb) !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          border-top-right-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
        }
        .calendar-wrapper .rdp-range_start.rdp-range_end .rdp-day_button,
        .calendar-wrapper .rdp-range_start.rdp-range_end {
          border-radius: 12px !important;
        }
        .calendar-wrapper .rdp-range_middle .rdp-day_button,
        .calendar-wrapper .rdp-range_middle {
          background-color: rgba(37, 99, 235, 0.18) !important;
          color: #93c5fd !important;
          font-weight: 600 !important;
          border-radius: 0 !important;
        }
        .calendar-wrapper .rdp-today .rdp-day_button {
          border: 1.5px solid #6366f1;
          color: #818cf8;
          font-weight: 700;
        }
        .calendar-wrapper .rdp-disabled {
          opacity: 0.25 !important;
          pointer-events: none !important;
        }
        .calendar-wrapper .rdp-outside {
          opacity: 0.35 !important;
        }
      `}</style>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-2 select-none font-sans", className)}
        classNames={{
          root: "relative",
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-3",
          month_caption: "flex justify-center pt-1 relative items-center mb-3",
          caption_label: "text-sm font-bold text-slate-100 tracking-wide",
          nav: "flex items-center justify-between absolute inset-x-0 top-1 px-1 z-10",
          button_previous: cn(
            "h-7 w-7 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition-all p-0 border border-slate-700/60 shadow-sm active:scale-95"
          ),
          button_next: cn(
            "h-7 w-7 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition-all p-0 border border-slate-700/60 shadow-sm active:scale-95"
          ),
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex justify-between mb-2",
          weekday: "text-slate-400 rounded-md w-9 font-semibold text-[0.75rem] text-center uppercase tracking-wider",
          week: "flex w-full mt-1 justify-between",
          day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day_button: cn(
            "h-9 w-9 p-0 font-medium rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-200 border-none outline-none focus:outline-none flex items-center justify-center cursor-pointer"
          ),
          range_start: "!bg-gradient-to-r !from-blue-600 !to-indigo-600 !text-white !font-bold !rounded-l-xl !rounded-r-none shadow-md shadow-blue-500/25",
          range_end: "!bg-gradient-to-r !from-indigo-600 !to-blue-600 !text-white !font-bold !rounded-r-xl !rounded-l-none shadow-md shadow-indigo-500/25",
          range_middle: "!bg-blue-600/20 !text-blue-200 !font-medium !rounded-none",
          selected: "!text-white",
          today: "border border-indigo-400/60 text-indigo-300 font-bold",
          outside: "text-slate-600 opacity-40 hover:opacity-70",
          disabled: "!text-slate-600 !opacity-25 !cursor-not-allowed !pointer-events-none hover:!bg-transparent",
          hidden: "invisible",
          ...classNames,
        }}
        components={{
          Chevron: ({ orientation, ...props }) => {
            if (orientation === "left") {
              return <ChevronLeft className="h-4 w-4" {...props} />;
            }
            return <ChevronRight className="h-4 w-4" {...props} />;
          },
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

