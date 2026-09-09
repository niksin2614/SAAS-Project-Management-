"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Search } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 mt-3 sm:mt-4">
        <div className="relative w-full sm:w-64">
          <Input
            className="w-full h-9 text-xs sm:text-sm px-3 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg shadow-sm"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {assignees.length > 0 && (
          <div className="flex-shrink-0">
            <div className="flex gap-1 flex-wrap items-center">
              {assignees.map((assignee, i) => {
                const selected = selectedAssignees.includes(assignee.id);

                return (
                  <div
                    key={assignee.id}
                    title={assignee.name}
                    className={`rounded-full ring-1.5 cursor-pointer transition-transform hover:scale-110 ${
                      selected ? "ring-blue-500 scale-105" : "ring-slate-800"
                    } ${i > 0 ? "-ml-2.5" : ""}`}
                    style={{
                      zIndex: i,
                    }}
                    onClick={() => toggleAssignee(assignee.id)}
                  >
                    <Avatar className="h-7 w-7 border border-slate-700 shadow-sm">
                      <AvatarImage src={assignee.imageUrl} />
                      <AvatarFallback className="bg-slate-800 text-[10px] font-bold text-slate-200">
                        {assignee.name ? assignee.name[0].toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-44 h-9 text-xs sm:text-sm bg-slate-950 border-slate-800 text-slate-100 rounded-lg">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority} className="text-xs sm:text-sm py-1.5">
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
            className="h-9 px-3 text-xs font-semibold flex items-center text-slate-300 hover:text-white"
          >
            <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
