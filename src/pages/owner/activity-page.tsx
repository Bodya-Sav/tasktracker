import type { User } from "@/api/schemas";
import type { Activity } from "@/api/schemas/activity";
import type { StatusMap } from "@/components/owner";
import { ActivitiesList } from "@/components/owner";

interface ActivityPageProps {
  filteredActivities: Activity[];
  user: User | null;
  statusMap: StatusMap;
  formatTimeRange: (a: Activity) => string;
}

export function ActivityPage({
  filteredActivities,
  user,
  statusMap,
  formatTimeRange,
}: ActivityPageProps) {
  return (
    <main className="flex-1 px-4 pt-4 pb-28">
      <div className="max-w-md mx-auto w-full">
        <ActivitiesList
          activities={filteredActivities}
          user={user}
          statusMap={statusMap}
          formatTimeRange={formatTimeRange}
        />
      </div>
    </main>
  );
}
