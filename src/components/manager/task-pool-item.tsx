import { Link } from "react-router-dom";

import type { Task } from "@/api/schemas";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

interface TaskPoolItemProps {
  task: Task;
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

export function TaskPoolItem({ task }: TaskPoolItemProps) {
  const priority = task.priority || "medium";
  return (
    <Link to={`/task/${task.id}`} className="block">
      <Item className="w-full bg-secondary shadow-md">
        <ItemContent className="w-full">
          <ItemHeader className="w-full">
            <ItemTitle className="w-full line-clamp-2 text-ellipsis whitespace-normal break-words">
              {task.title}
            </ItemTitle>
          </ItemHeader>

          {task.description ? (
            <ItemDescription className="line-clamp-2 text-ellipsis whitespace-normal break-words">
              {task.description}
            </ItemDescription>
          ) : null}

          <ItemFooter className="mt-2 flex items-center justify-between">
            <p className="text-white/15">нажмите, чтобы перейти</p>
            <Badge
              variant={
                priorityMap[priority as keyof typeof priorityMap]?.variant
              }>
              {priorityMap[priority as keyof typeof priorityMap]?.text}
            </Badge>
          </ItemFooter>
        </ItemContent>
      </Item>
    </Link>
  );
}
