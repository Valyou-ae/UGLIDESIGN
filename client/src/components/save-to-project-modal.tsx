import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Plus, Check, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { projectsApi, type ImageProject } from "@/lib/api";
import { cn } from "@/lib/utils";

const PROJECT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
];

interface SaveToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectId: string | null) => void;
  imageId?: string;
}

export function SaveToProjectModal({
  isOpen,
  onClose,
  onSave,
  imageId,
}: SaveToProjectModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState(PROJECT_COLORS[0]);
  const [createError, setCreateError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
    enabled: isOpen,
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: { name: string; color?: string }) =>
      projectsApi.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProjectId(result.project.id);
      setIsCreating(false);
      setNewProjectName("");
      setNewProjectColor(PROJECT_COLORS[0]);
      setCreateError(null);
    },
    onError: (error: Error) => {
      setCreateError(error.message || "Failed to create project");
    },
  });

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProjectMutation.mutate({
        name: newProjectName.trim(),
        color: newProjectColor,
      });
    }
  };

  const handleSave = () => {
    onSave(selectedProjectId);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedProjectId(null);
      setIsCreating(false);
      setNewProjectName("");
    }
  }, [isOpen]);

  const projects = projectsData?.projects || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Save to Project
          </DialogTitle>
          <DialogDescription>
            Choose a project to organize your image, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                      selectedProjectId === null
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                    data-testid="button-project-none"
                  >
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="flex-1 font-medium">No project</span>
                    {selectedProjectId === null && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>

                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                        selectedProjectId === project.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                      data-testid={`button-project-${project.id}`}
                    >
                      <div
                        className="h-8 w-8 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: project.color || "#6366f1" }}
                      >
                        <FolderKanban className="h-4 w-4 text-white" />
                      </div>
                      <span className="flex-1 font-medium">{project.name}</span>
                      {selectedProjectId === project.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {isCreating ? (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                  <Input
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => {
                      setNewProjectName(e.target.value);
                      setCreateError(null);
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateProject();
                      if (e.key === "Escape") setIsCreating(false);
                    }}
                    data-testid="input-new-project-name"
                  />
                  <div className="flex gap-2">
                    {PROJECT_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewProjectColor(color)}
                        className={cn(
                          "h-6 w-6 rounded-full transition-transform",
                          newProjectColor === color && "ring-2 ring-offset-2 ring-primary scale-110"
                        )}
                        style={{ backgroundColor: color }}
                        data-testid={`button-color-${color}`}
                      />
                    ))}
                  </div>
                  {createError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {createError}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCreating(false);
                        setCreateError(null);
                      }}
                      data-testid="button-cancel-create-project"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateProject}
                      disabled={!newProjectName.trim() || createProjectMutation.isPending}
                      data-testid="button-confirm-create-project"
                    >
                      {createProjectMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCreating(true)}
                  data-testid="button-new-project"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-save">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-to-project">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
