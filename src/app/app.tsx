import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ============================================================================
// API CLIENT (OPTIONAL - FOR BACKEND INTEGRATION)
// ============================================================================
// Uncomment these imports when connecting to a real backend:
//
// import {
//   useGetUnassignedTasks,
//   useGetUser,
//   useGetUserActivities,
// } from "@/api/client";
// ============================================================================
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  BottomTabs,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

import {
  CheckCheck,
  ClipboardList,
  Crown,
  EllipsisVertical,
  Hourglass,
  Plus,
  RefreshCcw,
  RotateCcw,
  Trash2,
} from "lucide-react";

type Tab = "todo" | "in_progress" | "done";

export type TaskCounts = {
  [key in Tab]: number;
};

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

import { TaskImportDrawer } from "@/components/owner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { SuccessAnimation } from "@/lib/SuccessAnimation";

import type { Activity } from "../api/schemas/activity";

function formatTimeRange(a: Activity) {
  if (!a.start_time?.Valid || !a.deadline?.Valid) return "";
  const s = new Date(a.start_time.Time);
  const d = new Date(a.deadline.Time);
  const fmt = (dt: Date) =>
    dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${fmt(s)} — ${fmt(d)}`;
}

const statusMap = {
  done: {
    icon: <CheckCheck className="text-green-500" />,
    badgeVariant: "success",
    text: "Done",
  },
  in_progress: {
    icon: <Hourglass className="text-yellow-500" />,
    badgeVariant: "warning",
    text: "In Progress",
  },
  todo: {
    icon: <ClipboardList className="text-muted-foreground" />,
    badgeVariant: "default",
    text: "To Do",
  },
};

// ============================================================================
// TELEGRAM INTEGRATION (OPTIONAL)
// ============================================================================
// To enable Telegram integration:
// 1. Uncomment the import below
// 2. Uncomment the telegramUser and activeTelegramUserId state
// 3. Make sure your backend supports the Telegram WebApp authentication
//
// import { getTelegramUser, type TelegramUser } from "@/lib/telegram";
// ============================================================================

// Mock data for demo mode (no backend required)
import {
  getActivities,
  getTasks,
  getUser as getMockUser,
  reinitializeMockData,
  resetMockData,
} from "@/lib/mock-data";

import { AppRoutes } from "./routes";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openImportDrawer } = useAppStore();

  const [activeTab, setActiveTab] = useState<Tab>("todo");
  const [activeUserId, setActiveUserId] = useState<number>(1); // 1 = owner, 2 = manager
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);
  const [isResetSuccessModalOpen, setIsResetSuccessModalOpen] = useState(false);

  const handleRoleSwitch = () => {
    setActiveUserId((prev) => (prev === 1 ? 2 : 1));
    navigate("/");
  };

  const handleResetData = () => {
    setIsResetConfirmModalOpen(true);
  };

  const handleConfirmReset = () => {
    resetMockData();
    setIsResetConfirmModalOpen(false);
    setIsResetSuccessModalOpen(true);
  };

  const handleReinitializeData = () => {
    reinitializeMockData();
    navigate(0); // Reload page
  };

  const handleCloseResetConfirmModal = () => {
    setIsResetConfirmModalOpen(false);
  };

  const handleCloseResetSuccessModal = () => {
    setIsResetSuccessModalOpen(false);
    navigate("/");
  };

  // Auto-close success modal after 3 seconds
  useEffect(() => {
    if (isResetSuccessModalOpen) {
      const timer = setTimeout(() => {
        setIsResetSuccessModalOpen(false);
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isResetSuccessModalOpen, navigate]);

  // ============================================================================
  // TELEGRAM INTEGRATION (OPTIONAL)
  // ============================================================================
  // Uncomment these lines to enable Telegram authentication:
  //
  // const [telegramUser] = useState<TelegramUser | null>(getTelegramUser());
  // const [activeTelegramUserId] = useState<number | null>(() => {
  //   const tgUser = getTelegramUser();
  //   if (tgUser) {
  //     return tgUser.id;
  //   }
  //   return null;
  // });
  // ============================================================================

  // For demo purposes, use mock user (default: first owner)
  // const activeUserId = 1;

  const handleTabChange = (value: string) => {
    setActiveTab(value as Tab);
  };

  // ============================================================================
  // DATA LOADING
  // ============================================================================
  // OPTION 1: Using Mock Data (Default - No Backend Required)
  // ============================================================================

  // Get user from mock data
  const user = getMockUser(activeUserId);

  // Get activities for owner
  const allActivities = getActivities();
  const ownerActivities = allActivities.filter(
    (a) => a.assign_id === activeUserId,
  );

  // Get unassigned tasks for manager
  const managerPendingTasks = getTasks();

  // Loading states (mock - instant)
  const isLoading = false;
  const isOwnerActivitiesLoading = false;
  const isManagerPendingTasksLoading = false;

  // Error states (mock - no errors)
  const isError = false;
  const isOwnerActivitiesError = false;
  const isManagerPendingTasksError = false;

  // ============================================================================
  // OPTION 2: Using Real API (Uncomment when connecting to backend)
  // ============================================================================
  //
  // const {
  //   data: user,
  //   isLoading,
  //   isError,
  //   error,
  // } = useGetUser(activeTelegramUserId!, { enabled: !!activeTelegramUserId });
  // const {
  //   data: ownerActivities,
  //   isLoading: isOwnerActivitiesLoading,
  //   isError: isOwnerActivitiesError,
  //   error: ownerActivitiesError,
  // } = useGetUserActivities(user?.id ?? 0, {
  //   enabled: user?.role === "owner" && !!user?.id,
  // });
  // const {
  //   data: managerPendingTasks,
  //   isLoading: isManagerPendingTasksLoading,
  //   isError: isManagerPendingTasksError,
  //   error: managerPendingTasksError,
  // } = useGetUnassignedTasks({ enabled: user?.role === "manager" });
  //
  // ============================================================================

  const counts = useMemo<TaskCounts>(() => {
    if (user?.role === "owner" && ownerActivities) {
      const todoCount = ownerActivities.filter(
        (activity) => activity.status === "todo",
      ).length;
      const inProgressCount = ownerActivities.filter(
        (activity) => activity.status === "in_progress",
      ).length;
      const doneCount = ownerActivities.filter(
        (activity) => activity.status === "done",
      ).length;
      return {
        todo: todoCount,
        in_progress: inProgressCount,
        done: doneCount,
      };
    }
    return { todo: 0, in_progress: 0, done: 0 };
  }, [ownerActivities, user?.role]);

  const filteredActivities = useMemo(() => {
    if (user?.role === "owner" && ownerActivities) {
      return ownerActivities.filter(
        (activity) => activity.status === activeTab,
      );
    }
    return [];
  }, [ownerActivities, activeTab, user?.role]);

  const updateActivityTime = (
    _taskId: number,
    _startTime: Date,
    _deadline: Date,
  ) => {
    navigate("/");
  };

  if (isLoading || isOwnerActivitiesLoading || isManagerPendingTasksLoading) {
    return <div>Loading data...</div>;
  }

  if (isError || isOwnerActivitiesError || isManagerPendingTasksError) {
    return <div>Error loading data: Unknown error</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* header */}
      <header className="bg-gradient-to-br from-[#8A2BE2] to-[#00FFFF] text-primary-foreground rounded-b-3xl px-4 py-4 sticky top-0 z-50">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* аватарка: если в проекте есть статический файл /avatar.png — он будет показан, иначе AvatarFallback покажет инициалы */}
          <Avatar>
            <AvatarImage
              src="./avatar.jpg"
              alt={`${user?.username ?? "User"} avatar`}
            />
            <AvatarFallback className="rounded-full bg-secondary">
              {initials(user?.username ?? "")}
            </AvatarFallback>
          </Avatar>

          {/* имя справа */}
          <div className="flex-1">
            <div className="text-base font-semibold flex gap-1">
              {user?.username ?? "—"}
              {user?.role === "owner" && (
                <Crown className="size-5 text-yellow-300" />
              )}
            </div>
            <div className="text-xs text-primary-foreground/80">
              {user?.tg_tag ?? ""}
            </div>
          </div>

          <div className="flex gap-1">
            {user?.role === "owner" &&
              !location.pathname.startsWith("/activity/") &&
              !location.pathname.startsWith("/create-activity") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full">
                      <Plus className="!w-5 !h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="bg-muted rounded-2xl border-white/20 shadow-md">
                    <DropdownMenuItem
                      onClick={() => navigate("/create-activity")}
                      className="py-3 px-3">
                      Создать задачу
                    </DropdownMenuItem>
                    <Separator className="bg-white/5" />
                    <DropdownMenuItem onClick={openImportDrawer}>
                      Загрузить пул задач
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

            {/* Role switcher button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRoleSwitch}
              className="rounded-full"
              title={
                user?.role === "owner" ? "Switch to Manager" : "Switch to Owner"
              }>
              <RefreshCcw className="!w-5 !h-5" />
            </Button>

            {/* Settings dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <EllipsisVertical className="!w-5 !h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                className="bg-muted rounded-2xl border-white/20 shadow-md">
                <DropdownMenuItem
                  onClick={handleReinitializeData}
                  className="py-3 px-3">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Восстановить данные
                </DropdownMenuItem>
                <Separator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={handleResetData}
                  className="py-3 px-3 text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить все данные
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <AppRoutes
        user={user ?? null}
        filteredActivities={filteredActivities}
        ownerActivities={ownerActivities ?? []}
        managerPendingTasks={managerPendingTasks ?? []}
        statusMap={statusMap}
        formatTimeRange={formatTimeRange}
        updateActivityTime={updateActivityTime}
      />

      {user?.role === "owner" &&
        !location.pathname.startsWith("/activity/") &&
        !location.pathname.startsWith("/create-activity") && (
          <BottomTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={counts}
          />
        )}
      <TaskImportDrawer />

      {/* Reset Confirm Modal */}
      <Dialog
        open={isResetConfirmModalOpen}
        onOpenChange={handleCloseResetConfirmModal}>
        <DialogContent className="select-none gap-6 rounded-2xl sm:max-w-sm w-[90vw] border-muted p-3">
          <DialogHeader className="gap-4 sm:text-center">
            <DialogTitle className="text-destructive">
              Удалить все данные?
            </DialogTitle>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mx-auto">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
          </DialogHeader>
          <div className="text-center text-muted-foreground">
            Это действие необратимо. Все задачи и активности будут удалены.
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleConfirmReset}
              className="w-full rounded-xl py-6">
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Success Modal */}
      <Dialog
        open={isResetSuccessModalOpen}
        onOpenChange={handleCloseResetSuccessModal}>
        <DialogContent className="select-none gap-6 rounded-2xl sm:max-w-sm w-[98vw] border-muted p-3">
          <DialogHeader className="gap-4 sm:text-center">
            <SuccessAnimation />
            <DialogTitle>Все данные успешно удалены!</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleCloseResetSuccessModal}
              className="w-full rounded-xl py-6">
              Продолжить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default App;
