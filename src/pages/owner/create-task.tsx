import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================================
// API CLIENT (OPTIONAL - FOR BACKEND INTEGRATION)
// ============================================================================
// Uncomment when connecting to a real backend:
//
// import { useCreateTask } from "@/api/client/tasks";
// ============================================================================
import type { CreateTaskRequest } from "@/api/schemas";
import {
  AutoExpandingTextarea,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SuccessAnimation,
} from "@/components/ui";
// ============================================================================
// LOCALSTORAGE (Default - No Backend Required)
// ============================================================================
import { createTask as createTaskInStorage } from "@/lib/mock-data";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [newActivity, setNewActivity] = useState<Partial<CreateTaskRequest>>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // ============================================================================
  // API MUTATION (OPTIONAL)
  // ============================================================================
  // Uncomment when connecting to a real backend:
  //
  // const createTaskMutation = useCreateTask();
  // ============================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const { name, value } = target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: "priority" | "status", value: string) => {
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!newActivity.title) {
      setError("Пожалуйста, заполните название.");
      return;
    }

    // ============================================================================
    // OPTION 1: Using LocalStorage (Default)
    // ============================================================================
    try {
      createTaskInStorage({
        title: newActivity.title,
        description: newActivity.description || "",
        priority: newActivity.priority as "low" | "medium" | "high",
        status: newActivity.status as "todo" | "in_progress" | "done",
      });
      setIsSuccessModalOpen(true);
    } catch {
      setError("Не удалось создать задачу.");
    }

    // ============================================================================
    // OPTION 2: Using Real API (Uncomment when connecting to backend)
    // ============================================================================
    //
    // createTaskMutation.mutate(newActivity as CreateTaskRequest, {
    //   onSuccess: () => {
    //     setIsSuccessModalOpen(true);
    //   },
    //   onError: () => {
    //     setError("Не удалось создать задачу.");
    //   }
    // });
    //
    // ============================================================================
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setNewActivity({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
    });
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto w-full h-screen flex flex-col mt-4 gap-3">
      <p className="text-center text-xl font-medium">Создание задачи</p>
      <div className="flex-1 overflow-y-auto px-2 space-y-3 pb-20">
        <div>
          <Label htmlFor="title">Название</Label>
          <AutoExpandingTextarea
            id="title"
            name="title"
            value={newActivity.title}
            onChange={handleInputChange}
            className="bg-black/30 rounded-2xl py-2 px-4"
          />
        </div>
        <div>
          <Label htmlFor="description">Описание</Label>
          <AutoExpandingTextarea
            id="description"
            name="description"
            value={newActivity.description || ""}
            onChange={handleInputChange}
            className="bg-black/30 rounded-2xl py-2 px-4"
          />
        </div>
        <div>
          <Label htmlFor="status">Статус</Label>
          <Select
            value={newActivity.status}
            onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger className="bg-black/30 rounded-2xl py-6 px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-muted rounded-2xl border-black/50">
              <SelectItem value="todo" className="py-2">
                To Do
              </SelectItem>
              <SelectItem value="in_progress" className="py-2">
                In Progress
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Приоритет</Label>
          <Select
            value={newActivity.priority}
            onValueChange={(value) => handleSelectChange("priority", value)}>
            <SelectTrigger className="bg-black/30 rounded-2xl py-6 px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-muted rounded-2xl border-black/50">
              <SelectItem value="low" className="py-2">
                Низкий
              </SelectItem>
              <SelectItem value="medium" className="py-2">
                Средний
              </SelectItem>
              <SelectItem value="high" className="py-2">
                Высокий
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>
      <footer className="sticky bottom-0 z-50 p-2 bg-background">
        <Button
          onClick={handleSubmit}
          className="w-full text-md py-6 rounded-2xl bg-[#0084ff]"
          disabled={false}>
          Создать активность
        </Button>
      </footer>
      <Dialog open={isSuccessModalOpen} onOpenChange={handleCloseSuccessModal}>
        <DialogContent className="select-none gap-6 rounded-2xl sm:max-w-sm w-[90vw] border-muted p-3">
          <DialogHeader className="gap-4 sm:text-center">
            <SuccessAnimation />
            <DialogTitle>Задача успешно создана!</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleCloseSuccessModal}
              className="w-full rounded-xl py-6">
              Продолжить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTaskPage;
