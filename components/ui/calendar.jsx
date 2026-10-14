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
    <div className="p-1 calendar-wrapper bg-[#09090c]">
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
          color: #d4d4d8;
          transition: all 0.15s ease;
        }
        .calendar-wrapper .rdp-day_button:hover {
          background-color: #1f1f23;
          color: #ffffff;
        }
        .calendar-wrapper .rdp-range_start .rdp-day_button,
        .calendar-wrapper .rdp-range_start {
          background: #ffffff !important;
          color: #000000 !important;
          font-weight: 700 !important;
          border-top-left-radius: 10px !important;
          border-bottom-left-radius: 10px !important;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
        }
        .calendar-wrapper .rdp-range_end .rdp-day_button,
        .calendar-wrapper .rdp-range_end {
          background: #ffffff !important;
          color: #000000 !important;
          font-weight: 700 !important;
          border-top-right-radius: 10px !important;
          border-bottom-right-radius: 10px !important;
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
        }
        .calendar-wrapper .rdp-range_start.rdp-range_end .rdp-day_button,
        .calendar-wrapper .rdp-range_start.rdp-range_end {
          border-radius: 10px !important;
        }
        .calendar-wrapper .rdp-range_middle .rdp-day_button,
        .calendar-wrapper .rdp-range_middle {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          border-radius: 0 !important;
        }
        .calendar-wrapper .rdp-today .rdp-day_button {
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          font-weight: 700;
        }
        .calendar-wrapper .rdp-disabled {
          opacity: 0.25 !important;
          pointer-events: none !important;
        }
        .calendar-wrapper .rdp-outside {
          opacity: 0.3 !important;
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
          caption_label: "text-sm font-bold text-white tracking-wide",
          nav: "flex items-center justify-between absolute inset-x-0 top-1 px-1 z-10",
          button_previous: cn(
            "h-7 w-7 bg-[#141418] hover:bg-[#1e1e24] text-neutral-300 hover:text-white rounded-lg flex items-center justify-center transition-all p-0 border border-white/10 shadow-sm active:scale-95"
          ),
          button_next: cn(
            "h-7 w-7 bg-[#141418] hover:bg-[#1e1e24] text-neutral-300 hover:text-white rounded-lg flex items-center justify-center transition-all p-0 border border-white/10 shadow-sm active:scale-95"
          ),
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex justify-between mb-2",
          weekday: "text-neutral-500 rounded-md w-9 font-semibold text-[0.75rem] text-center uppercase tracking-wider font-mono",
          week: "flex w-full mt-1 justify-between",
          day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day_button: cn(
            "h-9 w-9 p-0 font-medium rounded-xl hover:bg-[#1f1f23] hover:text-white transition-all text-neutral-200 border-none outline-none focus:outline-none flex items-center justify-center cursor-pointer"
          ),
          range_start: "!bg-white !text-black !font-bold !rounded-l-xl !rounded-r-none shadow-md",
          range_end: "!bg-white !text-black !font-bold !rounded-r-xl !rounded-l-none shadow-md",
          range_middle: "!bg-white/10 !text-white !font-medium !rounded-none",
          selected: "!text-white",
          today: "border border-white/30 text-white font-bold",
          outside: "text-neutral-600 opacity-40 hover:opacity-70",
          disabled: "!text-neutral-600 !opacity-20 !cursor-not-allowed !pointer-events-none hover:!bg-transparent",
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
