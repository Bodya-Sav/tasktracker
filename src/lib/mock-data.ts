// ============================================================================
// MOCK DATA & LOCALSTORAGE UTILITIES
// ============================================================================
// This file provides mock data and localStorage utilities for running the
// application without a backend. Data is persisted to localStorage on init.
// ============================================================================

import type { Activity } from "@/api/schemas/activity";
import type { Task } from "@/api/schemas/task";
import type { User } from "@/api/schemas/user";

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  ACTIVITIES: "tasktracker_activities",
  TASKS: "tasktracker_tasks",
  USERS: "tasktracker_users",
  INITIALIZED: "tasktracker_initialized",
};

// ============================================================================
// MOCK DATA (Initial seed data)
// ============================================================================

export const MOCK_USERS: User[] = [
  {
    id: 1,
    tg_id: 123456789,
    tg_tag: "@executor",
    username: "executor",
    role: "owner",
    created_at: new Date(),
  },
  {
    id: 2,
    tg_id: 987654321,
    tg_tag: "@dmanager",
    username: "manager",
    role: "manager",
    created_at: new Date(),
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: generateId(),
    title: "Разработать дизайн главной страницы",
    description: "Создать современный и удобный дизайн для главной страницы приложения",
    priority: "high",
    status: "todo",
    created_at: new Date(),
  },
  {
    id: generateId(),
    title: "Настроить CI/CD пайплайн",
    description: "Настроить автоматическое тестирование и деплой",
    priority: "medium",
    status: "todo",
    created_at: new Date(),
  },
  {
    id: generateId(),
    title: "Написать документацию API",
    description: "Документировать все эндпоинты и методы API",
    priority: "low",
    status: "todo",
    created_at: new Date(),
  },
  {
    id: generateId(),
    title: "Оптимизировать производительность",
    description: "Улучшить скорость загрузки страниц и отклика интерфейса",
    priority: "high",
    status: "todo",
    created_at: new Date(),
  },
  {
    id: generateId(),
    title: "Добавить тёмную тему",
    description: "Реализовать переключение между светлой и тёмной темой",
    priority: "medium",
    status: "todo",
    created_at: new Date(),
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: generateId(),
    task_id: 1,
    assign_id: 1,
    status: "in_progress",
    start_time: {
      Valid: true,
      Time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    deadline: {
      Valid: true,
      Time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    },
    task_pull: {
      id: 1,
      title: "Разработать дизайн главной страницы",
      description: "Создать современный и удобный дизайн для главной страницы приложения",
      priority: "high",
      created_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    task_id: 2,
    assign_id: 1,
    status: "todo",
    start_time: { Valid: false, Time: "" },
    deadline: { Valid: false, Time: "" },
    task_pull: {
      id: 2,
      title: "Настроить CI/CD пайплайн",
      description: "Настроить автоматическое тестирование и деплой",
      priority: "medium",
      created_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    task_id: 3,
    assign_id: 1,
    status: "done",
    start_time: {
      Valid: true,
      Time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    deadline: {
      Valid: true,
      Time: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    },
    task_pull: {
      id: 3,
      title: "Написать документацию API",
      description: "Документировать все эндпоинты и методы API",
      priority: "low",
      created_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a random unique ID
 */
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Get data from localStorage with fallback
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
  }
  return defaultValue;
}

/**
 * Save data to localStorage
 */
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// ============================================================================
// INITIALIZATION - Seed localStorage on first run
// ============================================================================

/**
 * Initialize localStorage with mock data if not already initialized
 * Call this once when the app starts
 */
export function initializeMockData(): void {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!isInitialized) {
    // Seed initial data
    saveToStorage(STORAGE_KEYS.USERS, MOCK_USERS);
    saveToStorage(STORAGE_KEYS.TASKS, MOCK_TASKS);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, MOCK_ACTIVITIES);
    saveToStorage(STORAGE_KEYS.INITIALIZED, "true");
    
    console.log("Mock data initialized in localStorage");
  }
}

/**
 * Reset all data - clear tasks and activities, keep users
 * Use for debugging or "reset app" functionality
 */
export function resetMockData(): void {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  console.log("Tasks and activities cleared");
}

/**
 * Re-initialize mock data - restore tasks, activities and users to initial state
 * Use for debugging or "restore default data" functionality
 */
export function reinitializeMockData(): void {
  // Restore users if they don't exist
  const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  if (storedUsers === null) {
    saveToStorage(STORAGE_KEYS.USERS, MOCK_USERS);
  }
  
  // Always restore tasks and activities
  saveToStorage(STORAGE_KEYS.TASKS, MOCK_TASKS);
  saveToStorage(STORAGE_KEYS.ACTIVITIES, MOCK_ACTIVITIES);
  console.log("Mock data restored");
}

// ============================================================================
// USER FUNCTIONS
// ============================================================================

export function getUser(id: number): User | null {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (stored === null) return null;
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  return users.find((u) => u.id === id) || null;
}

export function getAllUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (stored === null) return [];
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
}

// ============================================================================
// ACTIVITY FUNCTIONS (for Owner)
// ============================================================================

export function getActivities(): Activity[] {
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  if (stored === null) return [];
  return getFromStorage<Activity[]>(STORAGE_KEYS.ACTIVITIES, []);
}

export function saveActivities(activities: Activity[]): void {
  saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
}

export function updateActivity(id: number, updates: Partial<Activity>): Activity | null {
  const activities = getActivities();
  const index = activities.findIndex((a) => a.id === id);
  if (index === -1) return null;

  activities[index] = { ...activities[index], ...updates };
  saveActivities(activities);
  return activities[index];
}

export function createActivity(activity: Omit<Activity, "id" | "created_at">): Activity {
  const activities = getActivities();
  const newActivity: Activity = {
    ...activity,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  activities.push(newActivity);
  saveActivities(activities);
  return newActivity;
}

export function deleteActivity(id: number): boolean {
  const activities = getActivities();
  const filtered = activities.filter((a) => a.id !== id);
  if (filtered.length === activities.length) return false;
  saveActivities(filtered);
  return true;
}

// ============================================================================
// TASK FUNCTIONS (for Manager)
// ============================================================================

export function getTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (stored === null) return [];
  return getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
}

export function saveTasks(tasks: Task[]): void {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
}

export function updateTask(id: number, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updates };
  saveTasks(tasks);
  return tasks[index];
}

export function createTask(task: Omit<Task, "id" | "created_at">): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: generateId(),
    created_at: new Date(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function deleteTask(id: number): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveTasks(filtered);
  return true;
}
