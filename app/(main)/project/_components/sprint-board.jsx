"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import useFetch from "@/hooks/use-fetch";

import { useOrganization } from "@clerk/nextjs";
import statuses from "@/data/status";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";

import SprintManager from "./sprint-manager";
import IssueCreationDrawer from "./create-issue";
import IssueCard from "@/components/issue-card";
import BoardFilters from "./board-filters";

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const columnStatusDot = {
  TODO: "bg-neutral-400",
  IN_PROGRESS: "bg-sky-400",
  IN_REVIEW: "bg-amber-400",
  DONE: "bg-emerald-400",
};

export default function SprintBoard({ sprints, projectId, orgId }) {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";

  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  const [filteredIssues, setFilteredIssues] = useState(issues || []);

  const handleFilterChange = (newFilteredIssues) => {
    setFilteredIssues(newFilteredIssues);
  };

  // Sync filteredIssues whenever issues state updates
  useEffect(() => {
    setFilteredIssues(issues || []);
  }, [issues]);

  // Initial fetch and Real-time background sync (polls every 3s so no manual reload is ever needed)
  useEffect(() => {
    if (!currentSprint?.id) return;

    fetchIssues(currentSprint.id);

    const interval = setInterval(async () => {
      try {
        const latestIssues = await getIssuesForSprint(currentSprint.id);
        if (latestIssues) {
          setIssues(latestIssues);
        }
      } catch (err) {
        // silent background poll
      }
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSprint?.id]);

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  // Real-time optimistic update when an issue is created
  const handleIssueCreated = (createdIssue) => {
    if (createdIssue) {
      setIssues((prev) => {
        const list = prev ? [...prev, createdIssue] : [createdIssue];
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      setFilteredIssues((prev) => {
        const list = prev ? [...prev, createdIssue] : [createdIssue];
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      });
    }
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  };

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const onDragEnd = async (result) => {
    if (!isAdmin) {
      toast.warning("Only Admins can move tasks across board columns");
      return;
    }

    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...issues];

    // source and destination list
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );

      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      // remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId;

      // add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(newOrderedData, sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };

  if (issuesError) return <div className="text-rose-400 py-6 text-sm">Error loading sprint issues</div>;

  return (
    <div className="flex flex-col">
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )}

      {updateIssuesError && (
        <p className="text-rose-400 text-xs mt-2">{updateIssuesError.message}</p>
      )}
      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#ffffff" />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 bg-[#060608] border border-white/[0.08] p-3 sm:p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          {statuses.map((column) => {
            const columnIssues = filteredIssues?.filter((issue) => issue.status === column.key) || [];
            const dotClass = columnStatusDot[column.key] || "bg-neutral-400";

            return (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 bg-[#0a0a0d] p-3 rounded-xl border transition-colors flex flex-col min-h-[460px] ${
                      snapshot.isDraggingOver
                        ? "border-white/30 bg-[#0e0e12]"
                        : "border-white/[0.08]"
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] px-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                        <h3 className="font-mono font-bold text-xs tracking-wider uppercase text-neutral-300">
                          {column.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-neutral-400">
                        {columnIssues.length}
                      </span>
                    </div>

                    {/* Column Issue Cards Stack */}
                    <div className="space-y-2.5 flex-1">
                      {columnIssues.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                          isDragDisabled={updateIssuesLoading || !isAdmin}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-transform ${
                                snapshot.isDragging ? "opacity-90 scale-[1.02] shadow-2xl" : ""
                              }`}
                            >
                              <IssueCard
                                issue={issue}
                                onDelete={() => {
                                  setIssues((prev) => prev?.filter((i) => i.id !== issue.id));
                                  setFilteredIssues((prev) => prev?.filter((i) => i.id !== issue.id));
                                  if (currentSprint?.id) fetchIssues(currentSprint.id);
                                }}
                                onUpdate={(updated) => {
                                  setIssues((prev) =>
                                    prev?.map((i) => (i.id === updated.id ? updated : i))
                                  );
                                  setFilteredIssues((prev) =>
                                    prev?.map((i) => (i.id === updated.id ? updated : i))
                                  );
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {/* Add issue button on TODO column */}
                    {column.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-9 text-xs font-semibold border border-dashed border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-neutral-400 hover:text-white mt-1 rounded-xl transition-all flex items-center justify-center gap-1.5"
                          onClick={() => handleAddIssue(column.key)}
                        >
                          <Plus className="h-3.5 w-3.5 text-neutral-300" />
                          <span>Create Issue</span>
                        </Button>
                      )}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
}
