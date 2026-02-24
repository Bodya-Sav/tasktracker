import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ============================================================================
// API CLIENT (OPTIONAL - FOR BACKEND INTEGRATION)
// ============================================================================
// Uncomment when connecting to a real backend:
//
// import { useUpdateActivity } from "@/api/client";
// ============================================================================

import type { Activity } from "@/api/schemas/activity";
import {
  AutoExpandingTextarea,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";

// ============================================================================
// LOCALSTORAGE (Default - No Backend Required)
// ============================================================================
import { updateActivity as updateActivityInStorage } from "@/lib/mock-data";

const formatDateTime = (dt: Date | undefined) => {
  if (!dt) return "";
  return (
    dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

interface ActivityDetailProps {
  activities: Activity[];
}

const ActivityDetail = ({ activities }: ActivityDetailProps) => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const foundActivity = activities.find(
    (a) => a.id === parseInt(activityId || ""),
  );
  const [activity, setActivity] = useState<Activity | null>(
    foundActivity || null,
  );
  const [initialActivity] = useState<Activity | null>(foundActivity || null);
  const [initialStatus] = useState<Activity["status"] | undefined>(
    foundActivity?.status,
  );
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // API MUTATION (OPTIONAL)
  // ============================================================================
  // Uncomment when connecting to a real backend:
  //
  // const updateActivityMutation = useUpdateActivity();
  // ============================================================================

  if (!activity) {
    return <div className="text-center py-8">Активность не найдена</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const { name, value } = target;
    setActivity((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        task_pull: {
          ...prev.task_pull,
          [name]: value,
        },
      };
    });
  };

  const saveChanges = async () => {
    if (!activity) return;
    setError(null);

    try {
      // ============================================================================
      // OPTION 1: Using LocalStorage (Default)
      // ============================================================================
      const updated = updateActivityInStorage(activity.id, {
        task_id: activity.task_id,
        assign_id: activity.assign_id,
        start_time: activity.start_time,
        deadline: activity.deadline,
        status: activity.status,
        task_pull: activity.task_pull,
      });

      if (updated) {
        navigate("/");
      } else {
        setError("Не удалось сохранить изменения.");
      }

      // ============================================================================
      // OPTION 2: Using Real API (Uncomment when connecting to backend)
      // ============================================================================
      //
      // await updateActivityMutation.mutateAsync({
      //   id: activity.id,
      //   data: {
      //     task_id: activity.task_id,
      //     title: activity.task_pull?.title,
      //     assign_id: activity.assign_id,
      //     start_time: activity.start_time,
      //     deadline: activity.deadline,
      //     description: activity.task_pull.description,
      //     status: activity.status,
      //     priority: activity.task_pull?.priority,
      //   },
      // });
      // navigate("/");
      //
      // ============================================================================
    } catch (err) {
      setError("Не удалось сохранить изменения.");
      console.error("Failed to save changes:", err);
    }
  };

  const handleComplete = async () => {
    if (!activity) return;
    setError(null);

    try {
      // ============================================================================
      // OPTION 1: Using LocalStorage (Default)
      // ============================================================================
      const updated = updateActivityInStorage(activity.id, {
        task_id: activity.task_id,
        assign_id: activity.assign_id,
        start_time: activity.start_time,
        deadline: activity.deadline,
        status: "done",
        task_pull: activity.task_pull,
      });

      if (updated) {
        navigate("/");
      } else {
        setError("Не удалось завершить активность.");
      }

      // ============================================================================
      // OPTION 2: Using Real API (Uncomment when connecting to backend)
      // ============================================================================
      //
      // await updateActivityMutation.mutateAsync({
      //   id: activity.id,
      //   data: {
      //     task_id: activity.task_id,
      //     title: activity.task_pull?.title,
      //     assign_id: activity.assign_id,
      //     start_time: activity.start_time,
      //     deadline: activity.deadline,
      //     description: activity.task_pull.description,
      //     status: "done",
      //     priority: activity.task_pull?.priority,
      //   },
      // });
      // navigate("/");
      //
      // ============================================================================
    } catch (err) {
      setError("Не удалось завершить активность.");
      console.error("Failed to complete activity:", err);
    }
  };

  const isChanged =
    JSON.stringify(activity) !== JSON.stringify(initialActivity);

  return (
    <div className="max-w-md mx-auto w-full h-screen flex flex-col mt-4">
      <div className="flex-1 overflow-y-auto px-2 space-y-3 pb-20">
        <div>
          <Label htmlFor="title" className="text-md px-1 text-muted-foreground">
            Название
          </Label>
          <AutoExpandingTextarea
            id="title"
            name="title"
            value={activity.task_pull?.title || ""}
            onChange={handleInputChange}
            className="bg-black/30 rounded-2xl py-2 px-4"
          />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="text-md px-1 text-muted-foreground">
            Описание
          </Label>
          <AutoExpandingTextarea
            id="description"
            name="description"
            value={activity.task_pull?.description || ""}
            onChange={handleInputChange}
            className="bg-black/30 rounded-2xl py-2 px-4"
          />
        </div>
        <div>
          <Label
            htmlFor="status"
            className="text-md px-1 text-muted-foreground">
            Статус
          </Label>
          <Select
            value={activity.status}
            onValueChange={(value) =>
              setActivity((prev) => {
                if (!prev) return null;
                return { ...prev, status: value as Activity["status"] };
              })
            }>
            <SelectTrigger className="bg-black/30 rounded-2xl py-6 px-4">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent className="bg-muted rounded-2xl border-black/50">
              <SelectItem value="todo" className="py-3">
                To Do
              </SelectItem>
              <SelectItem value="in_progress" className="py-3">
                In Progress
              </SelectItem>
              <SelectItem value="done" className="py-3">
                Done
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="priority"
            className="text-md px-1 text-muted-foreground">
            Приоритет
          </Label>
          <Select
            value={activity.task_pull.priority}
            onValueChange={(value) =>
              setActivity((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  task_pull: {
                    ...prev.task_pull,
                    priority: value as "low" | "medium" | "high",
                  },
                };
              })
            }>
            <SelectTrigger className="bg-black/30 rounded-2xl py-6 px-4">
              <SelectValue placeholder="Выберите приоритет" />
            </SelectTrigger>
            <SelectContent className="bg-muted rounded-2xl border-black/50">
              <SelectItem value="low" className="py-3">
                Низкий
              </SelectItem>
              <SelectItem value="medium" className="py-3">
                Средний
              </SelectItem>
              <SelectItem value="high" className="py-3">
                Высокий
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />
        <div>
          <Label className="text-md px-1 text-muted-foreground">
            Длительность активности
          </Label>
          <p className="mb-4 bg-black/30 border border-muted rounded-2xl py-3 px-4">
            {activity.start_time?.Valid && activity.deadline?.Valid
              ? (() => {
                  const diff =
                    new Date(activity.deadline.Time).getTime() -
                    new Date(activity.start_time.Time).getTime();
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const minutes = Math.floor(
                    (diff % (1000 * 60 * 60)) / (1000 * 60),
                  );
                  let durationString = "";
                  if (hours > 0) {
                    durationString += `${hours} ч. `;
                  }
                  if (minutes > 0) {
                    durationString += `${minutes} мин.`;
                  }
                  return durationString.trim() || "0 мин.";
                })()
              : "-"}
          </p>
        </div>
        <div>
          <Label className="text-sm px-1 text-muted-foreground">
            Время начала
          </Label>
          <p className="mb-4 bg-black/30 border border-muted rounded-2xl py-3 px-4">
            {activity.start_time?.Valid
              ? formatDateTime(new Date(activity.start_time.Time))
              : "-"}
          </p>
        </div>
        <div>
          <Label className="text-sm px-1 text-muted-foreground">
            Время окончания
          </Label>
          <p className="mb-4 bg-black/30 border border-muted rounded-2xl py-3 px-4">
            {activity.deadline?.Valid
              ? formatDateTime(new Date(activity.deadline.Time))
              : "-"}
          </p>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <Separator />
      </div>
      <footer className="sticky bottom-0 z-50 bg-background rounded-t-2xl border-t-2 border-white/10">
        <div className="flex gap-2 p-2 rounded-t-2xl border-t border-muted">
          <Button
            onClick={handleComplete}
            className="w-full text-md py-6 rounded-2xl text-green-100 bg-green-400/50 border border-green-500"
            disabled={initialStatus === "done"}>
            Завершить
          </Button>
          <Button
            onClick={saveChanges}
            className="w-full text-md py-6 rounded-2xl bg-[#0084ff]"
            disabled={!isChanged}>
            Сохранить
          </Button>
        </div>
      </footer>
    </div>
  );
};

export { ActivityDetail };
export default ActivityDetail;
