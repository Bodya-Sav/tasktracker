import { useMemo, useState } from "react";

import type { Task } from "@/api/schemas";
import { TaskPoolList } from "@/components/manager";
import { Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskPoolPageProps {
  activities: Task[];
}

type Priority = "all" | "low" | "medium" | "high";

export function TaskPoolPage({ activities }: TaskPoolPageProps) {
  const [priorityFilter, setPriorityFilter] = useState<Priority>("all");

  const filteredTasks = useMemo(() => {
    if (priorityFilter === "all") {
      return activities;
    }
    return activities.filter((task) => task.priority === priorityFilter);
  }, [activities, priorityFilter]);

  return (
    <div className="max-w-md mx-auto w-full pb-8">
      <div className="mb-4">
        <Label
          htmlFor="priority-filter"
          className="text-md px-1 text-muted-foreground">
          Приоритет
        </Label>
        <Select
          value={priorityFilter}
          onValueChange={(value) => setPriorityFilter(value as Priority)}>
          <SelectTrigger className="bg-black/30 rounded-2xl py-6 px-4">
            <SelectValue placeholder="Фильтр по приоритету" />
          </SelectTrigger>
          <SelectContent className="bg-muted rounded-2xl border-black/50">
            <SelectItem value="all" className="py-3">
              Все
            </SelectItem>
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
      {filteredTasks.length > 0 ? (
        <TaskPoolList tasks={filteredTasks} />
      ) : (
        <p className="text-center text-muted-foreground pt-[25vh]">
          Список задач пуст
        </p>
      )}
    </div>
  );
}
