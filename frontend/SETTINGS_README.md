# Settings Page — Polished Profile & Preferences Editor

Полированная страница настроек с редактором профиля, четырьмя разделами (Profile, Appearance, Notifications, Password), анимациями, интерактивными виджетами, интеграцией с backend API и валидацией форм.

## Возможности

### Profile Section
- **Avatar Upload**: hover overlay, реальная загрузка через file input (max 5MB), анимация uploading state.
- **Form Fields**: имя, email, локация, bio (textarea с авто-ресайзом).
- **Validation**: анимированные ошибки для имени (min 2 символа) и email (regex валидация).
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

### Password Section ✨ NEW
- **3 поля**: Current Password, New Password, Confirm Password.
- **Real-time Strength Meter**: animated progress bar с цветовой кодировкой (weak/fair/good/strong).
- **Requirements Checklist**: 5 требований с анимированными иконками ✓ (length, uppercase, lowercase, number, special char).
- **Validation**: анимированные ошибки для каждого поля, проверка совпадения паролей.
- **Visual Feedback**: border-color меняется на error при ошибках, плавные fade-in анимации.

### UserMenu Dropdown ✨ NEW
- **Avatar Button**: в NavigationBar, cosmic gradient, glow shadow, hover scale.
- **Dropdown**: glass-контейнер с backdrop-blur, fade/scale анимация появления.
- **User Info**: аватар 48px, имя, email.
- **Menu Items**: Profile, Settings, Notifications, Help & Support с иконками и hover slide-in.
- **Logout Button**: красный цвет, отдельный от остальных с divider.
- **Click Outside**: закрытие при клике вне меню.

### Backend Integration ✨ NEW
- **SettingsService**: сервис для всех API запросов (getUserProfile, updateUserProfile, uploadAvatar, changePassword, и т.д.).
- **Auto-load**: Settings загружаются при монтировании страницы (useEffect).
- **Error Handling**: try-catch блоки, fallback для offline режима, TODO для error toasts.
- **Loading States**: индикатор загрузки, disabled кнопки при uploading/saving.

## Компоненты

```
src/pages/
└── Settings.js           # Главная страница, 4 таба, состояние, API integration, save feedback toast

src/components/
├── UserMenu.jsx          # Dropdown меню пользователя с Profile/Settings/Logout
└── settings/
    ├── ProfileSection.jsx    # Редактор профиля: аватар, форма, validation, actions
    ├── AppearanceSection.jsx # Тема, акцент, шрифт, доступность, density
    ├── NotificationSection.jsx # Переключатели уведомлений
    ├── PasswordSection.jsx   # Смена пароля с strength meter и requirements checklist ✨ NEW
    ├── ToggleSwitch.jsx      # Переключатель с градиентом и анимацией handle
    ├── Slider.jsx            # Слайдер с градиентным прогрессом и thumb
    └── SegmentedControl.jsx  # Сегментированный контрол для выбора опций

src/services/
└── settingsService.js    # API интеграция для всех настроек ✨ NEW
```

## Визуальные детали

### Password Section (NEW)
- **Strength Meter**: full-width progress bar, цвета weak=red, fair=orange, good=blue, strong=green.
- **Animated Fill**: width transition от 0% до score%, плавная анимация 0.3s.
- **Requirements**: secondary фон, rounded, каждый requirement с круглой иконкой (✓ когда met).
- **Icon Animation**: fade-in/slide-in при появлении, цвет success когда требование выполнено.
- **Error Messages**: red цвет, ⚠️ иконка, fade-in появление снизу (y: -5 → 0).

### UserMenu (NEW)
- **Button**: 40px круг, cosmic gradient, glow shadow, hover scale 1.05.
- **Dropdown**: 260px ширина, glass фон, backdrop-blur, xxl shadow, rounded xl.
- **UserInfo**: padding lg, border-bottom, avatar 48px с primary gradient, имя semibold.
- **MenuItem**: hover background secondary, color primary, slide-in animation (x: 0 → 4).
- **Logout**: error цвет, divider сверху, hover background secondary.

### Form Validation (NEW)
- **Error Borders**: border-color меняется на error (через style prop).
- **Error Messages**: под полем, sm font, error цвет, flex с иконкой ⚠️.
- **Animation**: fade-in + slide-up (opacity 0 → 1, y -5 → 0).
- **Clear on Type**: ошибка исчезает при изменении поля.

## Playful Details (оригинальные акценты)

- **Avatar Upload**: file input через document.createElement, валидация 5MB, uploading state с opacity 0.6.
- **Password Strength**: real-time calculation при каждом изменении, плавный color transition.
- **Requirements Icons**: круглые с background success/tertiary, ✓ появляется с animation.
- **UserMenu Backdrop**: fixed overlay для закрытия при клике вне, fade-in/out.
- **Error Shake**: можно добавить keyframes shake для input при ошибке (будущее расширение).
- **Success Toast**: gradient success, glow shadow, auto-hide 3s, scale/fade animation.

## Использование

```bash
cd frontend
npm start
```

Откройте **http://localhost:3000/settings**:
1. **Profile**: загрузите аватар (клик → file dialog), введите имя/email (валидация), нажмите Save.
2. **Appearance**: переключите тему, выберите акцентный цвет, измените размер шрифта.
3. **Notifications**: включите/выключите уведомления.
4. **Password** ✨: введите текущий пароль, новый (смотрите strength meter), подтвердите → Save.
5. **UserMenu** ✨: кликните на аватар в navbar → откроется dropdown с Settings и Logout.

## Backend Integration (реализовано)

### API Endpoints (требуются на сервере)
- `GET /api/v1/users/me` — получить профиль пользователя
- `PATCH /api/v1/users/me` — обновить профиль
- `POST /api/v1/users/me/avatar` — загрузить аватар (multipart/form-data)
- `GET /api/v1/users/me/settings` — получить настройки appearance
- `PATCH /api/v1/users/me/settings` — обновить настройки
- `GET /api/v1/users/me/notifications` — получить настройки уведомлений
- `PATCH /api/v1/users/me/notifications` — обновить уведомления
- `POST /api/v1/users/me/password` — сменить пароль

### SettingsService Methods
- `getUserProfile()` — GET profile
- `updateUserProfile(data)` — PATCH profile
- `uploadAvatar(file)` — POST avatar with FormData
- `getUserSettings()` — GET appearance settings
- `updateUserSettings(data)` — PATCH appearance
- `getNotificationSettings()` — GET notifications
- `updateNotificationSettings(data)` — PATCH notifications
- `changePassword(current, new)` — POST password change

### Error Handling
- Try-catch блоки в каждом методе
- Fallback к локальным данным при ошибке сети
- Console.error для логирования
- TODO: показывать error toast пользователю

## Расширения (готовы к реализации)

- **2FA Setup**: QR-код для authenticator app, backup codes, toggle для включения.
- **API Keys**: генерация/удаление ключей, копирование в clipboard с toast feedback.
- **Danger Zone**: удаление аккаунта (подтверждение modal), деактивация, экспорт данных (JSON/CSV).
- **Preferences**: язык UI, часовой пояс, формат даты/времени (dropdown с флагами).
- **Privacy**: видимость профиля (public/private), кто может видеть активность, блокировка пользователей.
- **Integrations**: подключение GitHub, Google, Slack, webhooks.
- **Activity Log**: история изменений настроек с timestamps.

---

**Новые возможности** ✨:
- ✅ Password Change с strength meter и requirements checklist
- ✅ UserMenu dropdown при клике на аватар
- ✅ Backend API integration через SettingsService
- ✅ Form validation с анимированными ошибками
- ✅ Real avatar upload через file input
- ✅ Loading states и error handling

**Особенности**: плавные transitions, playful micro-interactions, gradient accents, glass morphism, kinetic feedback, accessibility-ready (ARIA, focus states, reduced motion support), production-ready API integration.

