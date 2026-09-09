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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6">
        <div className="relative w-full sm:w-80">
          <Input
            className="w-full h-11 text-base px-4 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {assignees.length > 0 && (
          <div className="flex-shrink-0">
            <div className="flex gap-1.5 flex-wrap items-center">
              {assignees.map((assignee, i) => {
                const selected = selectedAssignees.includes(assignee.id);

                return (
                  <div
                    key={assignee.id}
                    title={assignee.name}
                    className={`rounded-full ring-2 cursor-pointer transition-transform hover:scale-110 ${
                      selected ? "ring-blue-500 scale-105" : "ring-slate-800"
                    } ${i > 0 ? "-ml-4" : ""}`}
                    style={{
                      zIndex: i,
                    }}
                    onClick={() => toggleAssignee(assignee.id)}
                  >
                    <Avatar className="h-10 w-10 border border-slate-700">
                      <AvatarImage src={assignee.imageUrl} />
                      <AvatarFallback className="bg-slate-800 text-xs font-bold text-slate-200">
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
          <SelectTrigger className="w-full sm:w-56 h-11 text-base bg-slate-950 border-slate-800 text-slate-100">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority} className="text-base py-2">
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-11 px-4 text-sm font-semibold flex items-center text-slate-300 hover:text-white"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
