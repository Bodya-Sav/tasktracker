import { useMemo, useState } from "react";
import type { JSX } from "preact/jsx-runtime";

import type { User } from "@/api/schemas";
import type { Activity } from "@/api/schemas/activity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ItemGroup } from "../ui/item";
import { ActivityItem } from "./activity-item";

export interface StatusMap {
  [key: string]: {
    icon: JSX.Element;
    badgeVariant: string;
    text: string;
  };
}

interface ActivitiesListProps {
  activities: Activity[];
  user: User | null;
  statusMap: StatusMap;
  formatTimeRange: (a: Activity) => string;
}

const priorityOrder: Record<"low" | "medium" | "high", number> = {
  high: 1,
  medium: 2,
  low: 3,
};

type PriorityFilter = "all" | "low" | "medium" | "high";
type SortOrder = "high-to-low" | "low-to-high";

export function ActivitiesList({
  activities,
  user,
  statusMap,
  formatTimeRange,
}: ActivitiesListProps) {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("high-to-low");

  const processedActivities = useMemo(() => {
    let filtered = activities;

    if (priorityFilter !== "all") {
      filtered = activities.filter(
        (a) => (a.task_pull?.priority || "medium") === priorityFilter,
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const priorityA = a.task_pull?.priority || "medium";
      const priorityB = b.task_pull?.priority || "medium";
      const order = priorityOrder[priorityA] - priorityOrder[priorityB];
      return sortOrder === "high-to-low" ? order : -order;
    });

    return sorted;
  }, [activities, priorityFilter, sortOrder]);

  return (
    <>
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <Select
            value={priorityFilter}
            onValueChange={(value) =>
              setPriorityFilter(value as PriorityFilter)
            }>
            <SelectTrigger
              id="priority-filter"
              className="bg-black/30 rounded-xl p-4">
              <SelectValue placeholder="Все" />
            </SelectTrigger>
            <SelectContent className="bg-muted rounded-2xl border-black/50">
              <SelectItem value="all" className="py-2">
                Все
              </SelectItem>
              <SelectItem value="high" className="py-2">
                Высокий
              </SelectItem>
              <SelectItem value="medium" className="py-2">
                Средний
              </SelectItem>
              <SelectItem value="low" className="py-2">
                Низкий
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger
              id="sort-order"
              className="bg-black/30 rounded-xl p-4">
              <SelectValue placeholder="От высокого к низкому" />
            </SelectTrigger>
            <SelectContent className="bg-muted rounded-2xl border-black/50">
              <SelectItem value="high-to-low" className="py-2">
                От high к low
              </SelectItem>
              <SelectItem value="low-to-high" className="py-2">
                От low к high
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ItemGroup className="gap-1.5">
        {processedActivities.map((a) => (
          <ActivityItem
            key={a.id}
            activity={a}
            user={user}
            statusMap={statusMap}
            formatTimeRange={formatTimeRange}
          />
        ))}

        {processedActivities.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Нет активностей
          </div>
        )}
      </ItemGroup>
    </>
  );
}
