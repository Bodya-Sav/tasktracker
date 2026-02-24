import { Route, Routes } from "react-router-dom";

import type { User } from "@/api/schemas";
import type { Task } from "@/api/schemas";
import type { Activity } from "@/api/schemas/activity";
import type { StatusMap } from "@/components/owner";
import { TaskDetailPage, TaskPoolPage } from "@/pages/manager";
import { ActivityDetail, ActivityPage, CreateTaskPage } from "@/pages/owner";

interface AppRoutesProps {
  user: User | null;
  filteredActivities: Activity[];
  ownerActivities: Activity[];
  managerPendingTasks: Task[];
  statusMap: StatusMap;
  formatTimeRange: (a: Activity) => string;
  updateActivityTime: (taskId: number, startTime: Date, deadline: Date) => void;
}

export function AppRoutes({
  user,
  filteredActivities,
  ownerActivities,
  managerPendingTasks,
  statusMap,
  formatTimeRange,
  updateActivityTime,
}: AppRoutesProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {user?.role === "owner" && (
              <ActivityPage
                filteredActivities={filteredActivities}
                user={user}
                statusMap={statusMap}
                formatTimeRange={formatTimeRange}
              />
            )}

            {user?.role === "manager" && (
              <main className="size-full px-4 pt-4">
                <TaskPoolPage activities={managerPendingTasks ?? []} />
              </main>
            )}
          </>
        }
      />
      <Route
        path="/task/:taskId"
        element={
          <TaskDetailPage
            activities={managerPendingTasks ?? []}
            onSetTime={updateActivityTime}
          />
        }
      />
      <Route
        path="/activity/:activityId"
        element={<ActivityDetail activities={ownerActivities ?? []} />}
      />
      <Route path="/create-activity" element={<CreateTaskPage />} />
    </Routes>
  );
}
