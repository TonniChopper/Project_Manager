# Settings Page — Polished Profile & Preferences Editor

Полированная страница настроек с редактором профиля, тремя разделами (Profile, Appearance, Notifications), анимациями и интерактивными виджетами.

## Возможности

### Profile Section
- **Avatar Upload**: hover overlay, анимация scale, симуляция загрузки (рандомная аватарка).
- **Form Fields**: имя, email, локация, bio (textarea с авто-ресайзом).
- **Actions**: кнопки Save/Reset с NeonButton, анимированная обратная связь (toast внизу справа).

### Appearance Section
- **Theme Preview**: карточки Light/Dark с эмодзи ☀️/🌙, анимации hover/tap, активное состояние с border glow.
- **Accent Color**: палитра из 6 градиентов (primary, secondary, accent, cosmic, sunset, ocean), swatch с hover scale.
- **Font Size**: SegmentedControl с тремя опциями (small/medium/large), плавный переход активного состояния.
- **Reduced Motion**: ToggleSwitch с анимацией handle scale при переключении.
- **Display Density**: Slider с градиентным прогрессом, thumb с hover/active анимациями.

### Notification Section
- **5 настроек**: Email, Push, Mentions, Updates, Marketing.
- **ToggleSwitch**: для каждой настройки с gradient/glow эффектами.
- **Описания**: краткие подсказки для каждой опции.

## Компоненты

```
src/pages/
└── Settings.js           # Главная страница, табы, состояние, save feedback toast

src/components/settings/
├── ProfileSection.jsx    # Редактор профиля: аватар, форма, actions
├── AppearanceSection.jsx # Тема, акцент, шрифт, доступность, density
├── NotificationSection.jsx # Переключатели уведомлений
├── ToggleSwitch.jsx      # Переключатель с градиентом и анимацией handle
├── Slider.jsx            # Слайдер с градиентным прогрессом и thumb
└── SegmentedControl.jsx  # Сегментированный контрол для выбора опций
```

## Визуальные детали

### Tabs (навигация по разделам)
- Glass-фон с backdrop-blur, активная вкладка с gradient fill.
- Плавный fade-in/slide transition при смене раздела.

### Profile
- **Avatar**: круглый превью 120px, border с primary цветом, glow shadow.
- **Overlay**: полупрозрачный черный фон с "Change Photo" на hover.
- **Upload**: клик → рандомная аватарка (симуляция), анимация scale.

### Appearance
- **Theme Preview**: 16:10 карточки с gradient mesh фоном (opacity 0.1), эмодзи иконки, border glow на active.
- **Color Swatches**: сетка 6 колонок, градиентные кнопки, активный с white border + glow, hover scale 1.1.
- **SegmentedControl**: glass контейнер, активная опция с gradient, hover color shift.

### Notification
- **Setting Cards**: secondary фон, rounded, flex layout с info слева и ToggleSwitch справа.
- **ToggleSwitch**: 52x28px, gradient когда включен, handle с scale bounce при переключении.

### Save Feedback
- **Toast**: fixed внизу справа, gradient success фон, white текст, glow shadow.
- **Анимация**: scale/fade-in появление, auto-hide через 3 секунды.

## Playful Details (оригинальные акценты)

- **Avatar Hover**: overlay плавно появляется, text "Change Photo" с semibold.
- **Color Swatches**: hover scale + тень, tap scale 0.9, активный с пульсирующим glow.
- **Slider Thumb**: grab cursor, grabbing on drag, scale 1.2 на hover, glow на active.
- **ToggleSwitch**: handle bounce анимация (scale [1, 1.2, 1]) при переключении.
- **Theme Cards**: rotate/scale micro-interactions, gradient mesh фон.
- **Tab Transition**: slide-in/out анимация контента (x: 20 → 0 → -20).

## Использование

```bash
cd frontend
npm start
```

Откройте **http://localhost:3000/settings**:
- Переключайтесь между вкладками (Profile/Appearance/Notifications).
- Загрузите аватар (клик на превью или кнопку "Upload New").
- Измените тему (Light/Dark), акцентный цвет, размер шрифта.
- Включите/выключите уведомления.
- Нажмите "Save Changes" → увидите toast внизу справа.

## Backend Integration (готовность)

Для сохранения настроек на сервере:
- Эндпоинты `/api/v1/users/me` (GET/PATCH) и `/api/v1/users/me/settings` (PATCH).
- Модель UserSettings в `backend/app/db/models.py` (theme, accent_color, font_size, notifications).
- Avatar upload: POST `/api/v1/users/me/avatar` с multipart/form-data, сохранение в S3/локально.

## Расширения (готовы к реализации)

- **Password Change**: секция с текущим/новым паролем, валидация силы, анимированный прогресс.
- **2FA Setup**: QR-код, backup codes, toggle для включения.
- **API Keys**: генерация/удаление ключей, копирование в clipboard с feedback.
- **Danger Zone**: удаление аккаунта, деактивация, экспорт данных.
- **Preferences**: язык, часовой пояс, формат даты/времени.
- **Privacy**: видимость профиля, кто может видеть активность, блокировка пользователей.

---

**Особенности**: плавные transitions, playful micro-interactions, gradient accents, glass morphism, kinetic feedback, accessibility-ready (ARIA, focus states, reduced motion support).

