import React, { useState } from "react";

import type { CreateTaskRequest } from "@/api/schemas";
// ============================================================================
// API CLIENT (OPTIONAL - FOR BACKEND INTEGRATION)
// ============================================================================
// Uncomment when connecting to a real backend:
//
// import { useImportTasks } from "@/api/client/tasks";
// ============================================================================
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { SuccessAnimation } from "@/components/ui/success-animation";
// ============================================================================
// LOCALSTORAGE (Default - No Backend Required)
// ============================================================================
import { createTask } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

export function TaskImportDrawer() {
  const { isImportDrawerOpen, closeImportDrawer } = useAppStore();
  const [file, setFile] = useState<File | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    failed: number;
  } | null>(null);

  // ============================================================================
  // API MUTATION (OPTIONAL)
  // ============================================================================
  // Uncomment when connecting to a real backend:
  //
  // const importTasksMutation = useImportTasks();
  // ============================================================================

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      setFile(target.files[0]);
    } else {
      setFile(null);
    }
  };

  const importTestTasks = async () => {
    try {
      const response = await fetch('/test.json');
      const tasks = await response.json() as CreateTaskRequest[];
      
      let imported = 0;
      let failed = 0;

      tasks.forEach((taskData) => {
        try {
          if (taskData.title) {
            createTask({
              title: taskData.title,
              description: taskData.description || "",
              priority: taskData.priority as "low" | "medium" | "high",
              status: taskData.status as "todo" | "in_progress" | "done",
            });
            imported++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      });

      closeImportDrawer();
      setImportResult({ imported, failed });
      setIsSuccessModalOpen(true);
    } catch (error) {
      alert("Не удалось импортировать тестовые задачи.");
      console.error("Import error:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }

    // ============================================================================
    // OPTION 1: Using LocalStorage (Default)
    // ============================================================================
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const tasks = JSON.parse(content) as CreateTaskRequest[];
          
          let imported = 0;
          let failed = 0;

          tasks.forEach((taskData) => {
            try {
              if (taskData.title) {
                createTask({
                  title: taskData.title,
                  description: taskData.description || "",
                  priority: taskData.priority as "low" | "medium" | "high",
                  status: taskData.status as "todo" | "in_progress" | "done",
                });
                imported++;
              } else {
                failed++;
              }
            } catch {
              failed++;
            }
          });

          setFile(null);
          closeImportDrawer();
          setImportResult({ imported, failed });
          setIsSuccessModalOpen(true);
        } catch (parseError) {
          alert("Ошибка parsing JSON файла. Убедитесь, что файл содержит корректный JSON.");
          console.error("Parse error:", parseError);
        }
      };
      reader.onerror = () => {
        alert("Ошибка чтения файла.");
      };
      reader.readAsText(file);
    } catch (error) {
      alert("Не удалось импортировать задачи.");
      console.error("Import error:", error);
    }

    // ============================================================================
    // OPTION 2: Using Real API (Uncomment when connecting to backend)
    // ============================================================================
    //
    // importTasksMutation.mutate(file, {
    //   onSuccess: (data) => {
    //     setFile(null);
    //     closeImportDrawer();
    //     setImportResult({ imported: data.imported, failed: data.failed });
    //     setIsSuccessModalOpen(true);
    //   },
    //   onError: (error: AxiosError<{ error: string }>) => {
    //     const errorMessage =
    //       error.response?.data?.error || "Не удалось импортировать задачи.";
    //     alert(errorMessage);
    //   },
    // });
    //
    // ============================================================================
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setImportResult(null);
  };

  return (
    <>
      <Drawer open={isImportDrawerOpen} onOpenChange={closeImportDrawer}>
        <DrawerContent className="space-y-2">
          <DrawerHeader>
            <DrawerTitle className="text-center">Импорт задач</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="py-2 space-y-4 rounded-xl">
            {/* Import test tasks button */}
            <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl">
              <p className="select-none text-sm text-muted-foreground text-center">
                Хотите попробовать? Импортируйте тестовые задачи в качестве примера
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={importTestTasks}
                className="rounded-xl bg-black/30">
                Импорт тестовых задач
              </Button>
            </div>

            <div className="flex flex-col w-full gap-1">
              <Input
                id="task-file"
                type="file"
                onChange={handleFileChange}
                accept=".json,.txt"
                className="bg-black/30 rounded-xl py-3 h-auto"
              />
              {file && (
                <p className="ml-3 text-sm text-muted-foreground text-ellipsis whitespace-normal break-words">
                  Выбран файл: {file.name}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl py-6"
              disabled={!file}>
              Загрузить
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
      <Dialog open={isSuccessModalOpen} onOpenChange={handleCloseSuccessModal}>
        <DialogContent className="select-none gap-6 rounded-2xl sm:max-w-sm w-[98vw] border-muted p-3">
          <DialogHeader className="gap-4 sm:text-center">
            <SuccessAnimation />
            <DialogTitle>Задачи успешно импортированы!</DialogTitle>
            <DialogDescription>
              {importResult && (
                <p>
                  Импортировано: {importResult.imported}
                  <br />
                  Не удалось: {importResult.failed}
                </p>
              )}
            </DialogDescription>
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
    </>
  );
}
