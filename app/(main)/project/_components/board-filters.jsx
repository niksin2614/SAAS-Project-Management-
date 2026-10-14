"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Search as SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function BoardFilters({ issues, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");

  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) => item && index === self.findIndex((t) => t?.id === item.id)
    );

  useEffect(() => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority)
    );
    onFilterChange(filteredIssues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedAssignees, selectedPriority, issues]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
  };

  const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "";

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 mt-4">
        {/* Search Bar with Icon */}
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <Input
            className="w-full h-10 text-xs sm:text-sm pl-9 pr-3 bg-[#0b0b0e] border-white/[0.12] focus-visible:border-white/50 text-neutral-100 placeholder:text-neutral-400 rounded-xl shadow-inner"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Assignee Stacking Filters */}
        {assignees.length > 0 && (
          <div className="flex-shrink-0">
            <div className="flex gap-1 flex-wrap items-center">
              {assignees.map((assignee, i) => {
                const selected = selectedAssignees.includes(assignee.id);

                return (
                  <div
                    key={assignee.id}
                    title={assignee.name}
                    className={`rounded-full ring-2 cursor-pointer transition-all hover:scale-110 ${
                      selected ? "ring-white scale-105" : "ring-transparent opacity-70 hover:opacity-100"
                    } ${i > 0 ? "-ml-2.5" : ""}`}
                    style={{
                      zIndex: i,
                    }}
                    onClick={() => toggleAssignee(assignee.id)}
                  >
                    <Avatar className="h-7 w-7 border border-white/20 shadow-md">
                      <AvatarImage src={assignee.imageUrl} />
                      <AvatarFallback className="bg-[#18181c] text-[10px] font-bold text-neutral-200">
                        {assignee.name ? assignee.name[0].toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Priority Select */}
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-44 h-10 text-xs sm:text-sm bg-[#0b0b0e] border-white/[0.12] text-neutral-100 rounded-xl">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent className="bg-[#0c0c0e] border border-white/10 text-neutral-100 shadow-xl">
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority} className="text-xs sm:text-sm py-2">
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltersApplied && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10 px-3 text-xs font-semibold flex items-center text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
