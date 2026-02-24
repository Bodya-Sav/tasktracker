# Task Tracker 🎯

**Telegram Mini App** для управления задачами и активностями команды.

<br />

## 📖 О проекте

Task Tracker — это веб-приложение для управления задачами, разработанное специально для **Telegram Mini Apps**.

### 👥 Роли пользователей

#### 👑 Владелец (Owner/Исполнитель)
- Создаёт новые задачи
- Импортирует пулы задач из JSON-файлов
- Видит свои активности в виде списка
- Управляет статусом активностей (To Do → In Progress → Done)
- Может редактировать задачи и завершать активности

#### 📋 Менеджер (Manager)
- Видит пул неназначенных задач
- Назначает задачи исполнителю (владельцу)
- Устанавливает время начала и дедлайн для каждой активности
- После назначения задача исчезает из пула и появляется у исполнителя

---

## 🚀 Возможности

- ✅ **Управление задачами** — создание, редактирование, удаление
- ✅ **Приоритеты** — высокий, средний, низкий (с цветовым кодированием)
- ✅ **Статусы** — To Do, In Progress, Done
- ✅ **Импорт задач** — загрузка пула задач из JSON-файла
- ✅ **Планирование** — установка времени начала и дедлайна
- ✅ **Фильтрация** — сортировка активностей по приоритету и статусу
- ✅ **Telegram Integration** — работает как Telegram Mini App
- ✅ **Offline-first** — данные сохраняются в localStorage

---

## 🛠 Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Frontend** | React 19 + TypeScript + Vite + Preact |
| **Styling** | Tailwind CSS + shadcn/ui |
| **State** | Zustand + TanStack Query |
| **Routing** | React Router v7 |
| **UI Components** | Radix UI Primitives |
| **Data** | localStorage (demo) / REST API (production) |
| **Platform** | Telegram Mini Apps |

---

## 📦 Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd tasktracker
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

### 4. Сборка для продакшена

```bash
npm run build
npm run preview  # предпросмотр продакшен-сборки
```

---

## 🎮 Как использовать

### Для владельца (исполнителя)

1. **Создать задачу:**
   - Нажмите `+` в хэдере
   - Выберите "Создать задачу"
   - Заполните название, описание, приоритет и статус

2. **Импортировать задачи:**
   - Нажмите `+` в хэдере
   - Выберите "Загрузить пул задач"
   - Загрузите JSON-файл или используйте тестовые данные

3. **Управление активностями:**
   - Переключайтесь между вкладками: To Do / In Progress / Done
   - Нажмите на активность для просмотра деталей
   - Редактируйте задачу или завершите активность

### Для менеджера

1. **Просмотр задач:**
   - Откройте вкладку "Task Pool"
   - Фильтруйте задачи по приоритету

2. **Назначить задачу:**
   - Выберите задачу из пула
   - Установите время начала и окончания
   - Нажмите "Назначить активность"
   - Задача исчезнет из пула и появится у исполнителя

---

## 📱 Интеграция с Telegram

### Настройка Telegram Bot

1. **Создайте бота:**
   - Откройте [@BotFather](https://t.me/botfather)
   - Отправьте `/newbot`
   - Следуйте инструкциям

2. **Настройте Web App:**
   ```
   /newapp
   ```
   - Укажите URL вашего приложения
   - Получите ссылку для запуска

3. **Включите Telegram WebApp:**
   - Раскомментируйте скрипт в `index.html`:
   ```html
   <script src="https://telegram.org/js/telegram-web-app.js"></script>
   ```

4. **Активируйте Telegram-аутентификацию:**
   - В `src/app/app.tsx` раскомментируйте:
   ```tsx
   import { getTelegramUser } from "@/lib/telegram";
   
   const [telegramUser] = useState(getTelegramUser());
   ```

---

## 💾 Хранение данных

### Demo-режим (localStorage)

Приложение автоматически инициализирует данные при первом запуске:

- `tasktracker_users` — пользователи
- `tasktracker_tasks` — задачи менеджера
- `tasktracker_activities` — активности владельца
- `tasktracker_initialized` — флаг инициализации

**Сброс данных:**
```javascript
localStorage.clear();
location.reload();
```

### Production-режим (Backend API)

Для подключения реального бэкенда:

1. Раскомментируйте API-импорты в файлах
2. Настройте `VITE_API_URL` в `.env`
3. Закомментируйте localStorage-вызовы

---

## 📁 Структура проекта

```
src/
├── api/                    # API клиент и схемы
│   ├── client/            # Функции API
│   └── schemas/           # TypeScript типы
├── app/                   # Основное приложение
│   ├── app.tsx            # Корневой компонент
│   ├── main.tsx           # Точка входа
│   └── routes/            # Маршруты
├── components/
│   ├── ui/                # UI компоненты
│   ├── owner/             # Компоненты владельца
│   └── manager/           # Компоненты менеджера
├── lib/
│   ├── mock-data.ts       # Mock-данные и localStorage
│   ├── store.ts           # Zustand store
│   ├── telegram.ts        # Telegram WebApp утилиты
│   └── utils.ts           # Хелперы
└── pages/
    ├── owner/             # Страницы владельца
    └── manager/           # Страницы менеджера
```

---

## 🔧 Команды разработки

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка продакшена
npm run build

# Предпросмотр сборки
npm run preview

# Линтинг
npm run lint

# Проверка типов
npm run type-check
```

---

## 🎨 Особенности UI/UX

- 🌈 **Градиентный хэдер** — фиолетово-бирюзовый градиент
- 📱 **Mobile-first** — оптимизировано для мобильных устройств
- 🎯 **Bottom Tabs** — навигация через нижние табы
- ⚡ **Анимации** — плавные переходы и эффекты
- 🌓 **Тёмная тема** — поддержка тёмной темы по умолчанию

---

<br>

<details>
<summary><b>🇬🇧 English version (click to expand)</b></summary>

---

# Task Tracker 🎯

**Telegram Mini App** for team task and activity management.

---

## 📖 About

Task Tracker is a web application for task management, designed specifically for **Telegram Mini Apps**.

### 👥 User Roles

#### 👑 Owner (Executor)
- Creates new tasks
- Imports task pools from JSON files
- Views activities as a list
- Manages activity statuses (To Do → In Progress → Done)
- Can edit tasks and complete activities

#### 📋 Manager
- Views pool of unassigned tasks
- Assigns tasks to the executor (owner)
- Sets start time and deadline for each activity
- After assignment, task disappears from pool and appears with executor

---

## 🚀 Features

- ✅ **Task Management** — create, edit, delete
- ✅ **Priorities** — high, medium, low (with color coding)
- ✅ **Statuses** — To Do, In Progress, Done
- ✅ **Task Import** — load task pools from JSON files
- ✅ **Scheduling** — set start time and deadline
- ✅ **Filtering** — sort activities by priority and status
- ✅ **Telegram Integration** — works as Telegram Mini App
- ✅ **Offline-first** — data persists in localStorage

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19 + TypeScript + Vite + Preact |
| **Styling** | Tailwind CSS + shadcn/ui |
| **State** | Zustand + TanStack Query |
| **Routing** | React Router v7 |
| **UI Components** | Radix UI Primitives |
| **Data** | localStorage (demo) / REST API (production) |
| **Platform** | Telegram Mini Apps |

---

## 📦 Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd tasktracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Mode

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview  # preview production build
```

---

## 🎮 How to Use

### For Owner (Executor)

1. **Create Task:**
   - Tap `+` in header
   - Select "Create Task"
   - Fill title, description, priority, and status

2. **Import Tasks:**
   - Tap `+` in header
   - Select "Load Task Pool"
   - Upload JSON file or use test data

3. **Manage Activities:**
   - Switch between tabs: To Do / In Progress / Done
   - Tap activity to view details
   - Edit task or complete activity

### For Manager

1. **View Tasks:**
   - Open "Task Pool" tab
   - Filter tasks by priority

2. **Assign Task:**
   - Select task from pool
   - Set start and end time
   - Tap "Assign Activity"
   - Task disappears from pool and appears with executor

---

## 📱 Telegram Integration

### Setup Telegram Bot

1. **Create Bot:**
   - Open [@BotFather](https://t.me/botfather)
   - Send `/newbot`
   - Follow instructions

2. **Setup Web App:**
   ```
   /newapp
   ```
   - Specify your app URL
   - Get launch link

3. **Enable Telegram WebApp:**
   - Uncomment script in `index.html`:
   ```html
   <script src="https://telegram.org/js/telegram-web-app.js"></script>
   ```

4. **Activate Telegram Auth:**
   - In `src/app/app.tsx` uncomment:
   ```tsx
   import { getTelegramUser } from "@/lib/telegram";
   
   const [telegramUser] = useState(getTelegramUser());
   ```

---

## 💾 Data Storage

### Demo Mode (localStorage)

App auto-initializes data on first launch:

- `tasktracker_users` — users
- `tasktracker_tasks` — manager tasks
- `tasktracker_activities` — owner activities
- `tasktracker_initialized` — init flag

**Reset Data:**
```javascript
localStorage.clear();
location.reload();
```

### Production Mode (Backend API)

To connect real backend:

1. Uncomment API imports in files
2. Set `VITE_API_URL` in `.env`
3. Comment out localStorage calls

---

## 📁 Project Structure

```
src/
├── api/                    # API client and schemas
│   ├── client/            # API functions
│   └── schemas/           # TypeScript types
├── app/                   # Main application
│   ├── app.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── routes/            # Routes
├── components/
│   ├── ui/                # UI components
│   ├── owner/             # Owner components
│   └── manager/           # Manager components
├── lib/
│   ├── mock-data.ts       # Mock data and localStorage
│   ├── store.ts           # Zustand store
│   ├── telegram.ts        # Telegram WebApp utilities
│   └── utils.ts           # Helpers
└── pages/
    ├── owner/             # Owner pages
    └── manager/           # Manager pages
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linting
npm run lint

# Type check
npm run type-check
```

---

## 🎨 UI/UX Features

- 🌈 **Gradient Header** — purple-turquoise gradient
- 📱 **Mobile-first** — optimized for mobile devices
- 🎯 **Bottom Tabs** — navigation via bottom tabs
- ⚡ **Animations** — smooth transitions and effects
- 🌓 **Dark Theme** — dark theme support by default
