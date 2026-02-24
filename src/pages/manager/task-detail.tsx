import { useState } from "react";
import { useParams } from "react-router-dom";

// ============================================================================
// API CLIENT (OPTIONAL - FOR BACKEND INTEGRATION)
// ============================================================================
// Uncomment when connecting to a real backend:
//
// import { getAllUsers } from "@/api/client";
// import { useAssignTaskActivity } from "@/api/client/activities";
// ============================================================================
import type { Task } from "@/api/schemas";
import { Badge, Button, TimePickerDrawer } from "@/components/ui";
// ============================================================================
// LOCALSTORAGE (Default - No Backend Required)
// ============================================================================
import { createActivity, deleteTask, getAllUsers } from "@/lib/mock-data";

interface TaskDetailPageProps {
  activities: Task[];
  onSetTime: (taskId: number, startTime: Date, deadline: Date) => void;
}

type Priority = "high" | "medium" | "low";
type PriorityMap = Record<
  Priority,
  {
    text: string;
    variant: "destructive" | "warning" | "success";
  }
>;

const priorityMap: PriorityMap = {
  low: { text: "Низкий", variant: "success" },
  medium: { text: "Средний", variant: "warning" },
  high: { text: "Высокий", variant: "destructive" },
};

export function TaskDetailPage({ activities, onSetTime }: TaskDetailPageProps) {
  const { taskId } = useParams<{ taskId: string }>();
  const task = activities.find((a) => a.id === Number(taskId));

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // API MUTATION (OPTIONAL)
  // ============================================================================
  // Uncomment when connecting to a real backend:
  //
  // const queryClient = useQueryClient();
  // const users = getAllUsers();
  // const assignTaskActivityMutation = useAssignTaskActivity();
  // ============================================================================

  if (!task) {
    return <div className="text-center py-8">Задача не найдена</div>;
  }

  const priority = task.priority || "medium";

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    const [h, m] = newStartTime.split(":").map(Number);
    const newEndTime = new Date();
    newEndTime.setHours(h + 1, m);
    const formattedEndTime = `${newEndTime.getHours().toString().padStart(2, "0")}:${newEndTime.getMinutes().toString().padStart(2, "0")}`;
    setEndTime(formattedEndTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startTime || !endTime) {
      setError("Пожалуйста, выберите время начала и окончания.");
      return;
    }

    const today = new Date();
    const startDateTime = new Date(`${today.toDateString()} ${startTime}`);
    const endDateTime = new Date(`${today.toDateString()} ${endTime}`);

    if (endDateTime.getTime() - startDateTime.getTime() < 60 * 60 * 1000) {
      setError("Активность не может быть менее одного часа.");
      return;
    }

    try {
      // ============================================================================
      // OPTION 1: Using LocalStorage (Default)
      // ============================================================================
      const users = getAllUsers();
      const owner = users.find(u => u.role === 'owner');

      if (owner) {
        createActivity({
          task_id: task.id,
          assign_id: owner.id,
          status: "todo",
          start_time: {
            Valid: true,
            Time: startDateTime.toISOString(),
          },
          deadline: {
            Valid: true,
            Time: endDateTime.toISOString(),
          },
          task_pull: {
            title: task.title,
            description: task.description || "",
            priority: task.priority || "medium",
            id: 0,
            created_at: ""
          },
        });

        // Delete the task from manager's pool after assigning
        deleteTask(task.id);

        onSetTime(task.id, startDateTime, endDateTime);
      } else {
        setError("Владелец не найден.");
      }

      // ============================================================================
      // OPTION 2: Using Real API (Uncomment when connecting to backend)
      // ============================================================================
      //
      // if (users) {
      //   const owner = (await users).find(u => u.role === 'owner');
      //   if (owner) {
      //     await assignTaskActivityMutation.mutateAsync({
      //       assign_id: owner.id,
      //       task_id: task.id,
      //       status: "todo",
      //       start_time: startDateTime.toISOString(),
      //       deadline: endDateTime.toISOString(),
      //     }, {
      //       onSuccess: () => {
      //         queryClient.invalidateQueries({ queryKey: ["unassignedTasks"] });
      //         onSetTime(task.id, startDateTime, endDateTime);
      //       }
      //     });
      //   } else {
      //     setError("Владелец не найден.");
      //   }
      // }
      //
      // ============================================================================
    } catch {
      setError("Не удалось назначить задачу.");
    }
  };

  return (
    <div className="max-w-md mx-auto w-full h-screen mt-28 flex flex-col">
      <div className="overflow-y-auto space-y-3 flex-grow px-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <p className="text-md px-1 text-muted-foreground">Название</p>
            <div className="flex items-center gap-3 px-1">
              <span className="text-md text-muted-foreground">приоритет</span>
              <Badge
                variant={
                  priorityMap[priority as keyof typeof priorityMap]?.variant
                }>
                {priorityMap[priority as keyof typeof priorityMap]?.text}
              </Badge>
            </div>
          </div>
          <h1 className="text-md font-bold mb-2 bg-black/30 rounded-2xl py-3 px-4 whitespace-normal break-words">
            {task.title}
          </h1>
        </div>
        {task.description && (
          <div className="flex flex-col gap-1">
            <p className="text-md px-1 text-muted-foreground">Описание</p>
            <p className="mb-4 bg-black/30 rounded-2xl py-3 px-4 whitespace-normal break-words">
              {task.description}
            </p>
          </div>
        )}
        <form className="space-y-4 px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="start-time"
                className="block text-md text-muted-foreground">
                Время начала
              </label>
              <TimePickerDrawer
                id="start-time"
                value={startTime}
                onChange={handleStartTimeChange}
                title="Выберите время начала"
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="end-time"
                className="block text-md text-muted-foreground">
                Время окончания
              </label>
              <TimePickerDrawer
                id="end-time"
                value={endTime}
                onChange={setEndTime}
                title="Выберите время окончания"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>
      <footer className="sticky bottom-0 z-10 bg-background rounded-t-2xl border-t-2 border-white/10">
        <div className="flex gap-2 p-2 rounded-t-2xl border-t border-muted">
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full text-md py-6 rounded-2xl bg-[#0084ff]">
            Назначить активность
          </Button>
        </div>
      </footer>
    </div>
  );
}
