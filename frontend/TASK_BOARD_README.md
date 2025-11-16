# Task Management Board — Kanban с Drag-and-Drop

Интерактивная доска управления задачами в стиле Kanban, построенная на React + styled-components + framer-motion + @dnd-kit.

## Возможности

- **Drag & Drop**: перетаскивание карточек между колонками и внутри них (@dnd-kit/core, @dnd-kit/sortable).
- **4 статуса**: To Do, In Progress, Review, Done — с цветовыми индикаторами (blob) и градиентами.
- **Карточки задач**: заголовок, описание (clamp 2 строки), приоритет (badge), срок (дата), аватары исполнителей.
- **Модальное окно**: редактирование задачи (title, description, status, priority, dueDate) с стеклянными input/textarea и анимациями появления.
- **Анимации**: пульсирующие индикаторы, hover/drag эффекты, плавные переходы transform/opacity.
- **Тема**: использует глобальную систему тем (gradients, shadows, radius, transitions).

## Структура компонентов

```
src/components/tasks/
├── KanbanBoard.jsx    # Контейнер DndContext, группировка по статусам
├── KanbanColumn.jsx   # Колонка с заголовком, счётчиком, blob-индикатором
├── TaskCard.jsx       # Карточка задачи (useSortable), badge приоритета, аватары
└── TaskModal.jsx      # Модальное окно редактирования (overlay + form)

src/pages/
└── Tasks.js           # Страница с заголовком и KanbanBoard, хендлеры создания/обновления
```

## Мок-данные

В `Tasks.js` определён `mockTasks` с 6 задачами:
- t1: To Do (high priority, dueDate, 1 исполнитель)
- t2, t3: In Progress (high/medium, несколько исполнителей)
- t4: Review (medium)
- t5, t6: Done (low/high)

## Визуальные детали

- **Blob-индикатор**: пульсирующий кружок в заголовке колонки с gradient и box-shadow glow.
- **Drag-состояния**: при перетаскивании карточка получает opacity 0.5 и тень xl; целевая колонка подсвечивается border + glow.
- **Hover**: карточка приподнимается (translateY -2px) и меняет border на primary.
- **Модаль**: backdrop-blur overlay, scale/fade анимации при открытии/закрытии, кнопка закрытия с rotate на hover.

## Планы развития

- **Inline editing**: редактирование title прямо в карточке (contentEditable или input toggle).
- **Добавление исполнителей**: поиск/выбор пользователей с аватарами.
- **Фильтры/поиск**: по приоритету, исполнителю, статусу.
- **Бэкенд интеграция**: сохранение изменений через API, WebSocket для real-time обновлений.
- **Прогресс-бары**: визуализация completion в карточке/колонке.

## Запуск

```bash
cd frontend
npm install
npm start
```

Откройте http://localhost:3000/tasks и перетаскивайте карточки между колонками!

## Зависимости

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag-and-drop
- `framer-motion` — анимации
- `styled-components` — стилизация
- `react-router-dom` — роутинг

---

**Inspired by**: Trello, Linear, Monday.com  
**Original touches**: Blob-индикаторы, kinetic movement, glassmorphism, neon glows

