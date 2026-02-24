import * as React from "react";
import { Link } from "react-router-dom";
import type { JSX } from "preact/jsx-runtime";

import type { User } from "@/api/schemas";
import type { Activity } from "@/api/schemas/activity";

import { Badge } from "../ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "../ui/item";

interface StatusMap {
  [key: string]: {
    icon: JSX.Element;
    badgeVariant: string;
    text: string;
  };
}

type Priority = "high" | "medium" | "low";
type PriorityMap = Record<
  Priority,
  {
    text: string;
    variant: "destructive" | "warning" | "success";
  }
>;

interface ActivityItemProps {
  activity: Activity;
  user: User | null;
  statusMap: StatusMap;
  formatTimeRange: (a: Activity) => string;
}

const priorityMap: PriorityMap = {
  high: { text: "Высокий", variant: "destructive" },
  medium: { text: "Средний", variant: "warning" },
  low: { text: "Низкий", variant: "success" },
};

export function ActivityItem({
  activity,
  user,
  statusMap,
  formatTimeRange,
}: ActivityItemProps) {
  const icon = statusMap[activity.status as keyof typeof statusMap]?.icon;
  const priority = activity.task_pull?.priority as Priority | undefined;

  return (
    <Link
      to={
        user?.role === "owner"
          ? `/activity/${activity.id}`
          : `/task/${activity.id}`
      }
      className="block">
      <Item className="w-full bg-secondary items-start">
        <ItemContent className="w-full">
          <ItemHeader className="w-full flex gap-4 items-start justify-start">
            <div className="flex items-center justify-center w-8 h-8 shrink-0">
              {icon &&
                React.cloneElement(icon, {
                  className: `${icon.props.className} size-6`,
                })}
            </div>
            <ItemTitle className="w-full line-clamp-2 text-ellipsis whitespace-normal break-words">
              {activity.task_pull?.title
                ? activity.task_pull.title
                : "_У задачи нет заголовка_"}
            </ItemTitle>
          </ItemHeader>

          {activity.task_pull?.description ? (
            <ItemDescription className="w-full line-clamp-2 text-ellipsis whitespace-normal break-words">
              {activity.task_pull.description}
            </ItemDescription>
          ) : (
            <ItemDescription>{"_описания нет_"}</ItemDescription>
          )}

          <ItemFooter className="mt-2 flex items-center justify-between">
            <div className="text-[11px] text-muted-foreground">
              {formatTimeRange(activity)}
            </div>
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
