import type { Task } from "@/api/schemas";
import { Badge } from "@/components/ui/badge";
import { ItemGroup } from "@/components/ui/item";

import { TaskPoolItem } from "./task-pool-item";

interface TaskPoolListProps {
  tasks: Task[];
}

type Priority = "high" | "medium" | "low";
type PriorityMap = Record<
  Priority,
  {
    text: string;
    variant: "destructive" | "warning" | "success";
  }
>;

export function TaskPoolList({ tasks }: TaskPoolListProps) {
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const priority = task.priority || "medium";
      if (!acc[priority]) {
        acc[priority] = [];
      }
      acc[priority].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  const priorityOrder: Priority[] = ["high", "medium", "low"];

  const priorityMap: PriorityMap = {
    low: { text: "Низкий", variant: "success" },
    medium: { text: "Средний", variant: "warning" },
    high: { text: "Высокий", variant: "destructive" },
  };

  return (
    <div className="space-y-6 pb-28">
      {priorityOrder.map((priority) => {
        const tasks = groupedTasks[priority];
        if (!tasks || tasks.length === 0) return null;

        return (
          <div key={priority}>
            <div className="flex justify-center items-center gap-2 mb-2 text-md font-medium">
              <Badge
                className="text-sm"
                variant={priorityMap[priority]?.variant}>
                {priorityMap[priority]?.text}
              </Badge>
              <p>приоритет</p>
            </div>
            <ItemGroup className="gap-1.5">
              {tasks.map((task) => (
                <TaskPoolItem key={task.id} task={task} />
              ))}
            </ItemGroup>
          </div>
        );
      })}
    </div>
  );
}
