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
  return result;
}

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

  if (issuesError) return <div>Error loading issues</div>;

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
        <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
      )}
      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#3b82f6" />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 bg-slate-900/90 border border-slate-800/80 p-5 rounded-xl shadow-xl">
          {statuses.map((column) => {
            const columnIssues = filteredIssues?.filter((issue) => issue.status === column.key) || [];

            return (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50 flex flex-col min-h-[500px]"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 px-1">
                      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-300">
                        {column.name}
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {columnIssues.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {columnIssues.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                          isDragDisabled={updateIssuesLoading || !isAdmin}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
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

                    {column.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          className="w-full h-11 text-sm font-semibold border border-dashed border-slate-800 hover:border-slate-600 hover:bg-slate-900 text-slate-300 hover:text-white mt-2"
                          onClick={() => handleAddIssue(column.key)}
                        >
                          <Plus className="mr-2 h-4 w-4 text-blue-400" />
                          Create Issue
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
