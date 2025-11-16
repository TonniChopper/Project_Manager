# 🎨 Eye-Catching Theme System

A stunning, modern visual theme for the Project Manager platform featuring glassmorphism, gradient backgrounds, neon effects, and playful micro-interactions.

## 🌟 Features

### Visual Effects
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Vibrant, animated gradients inspired by modern design
- **Neon Glow**: Subtle to intense glow effects for interactive elements
- **Smooth Animations**: Framer Motion powered animations
- **Mesh Gradients**: Dynamic background patterns

### Theme Modes
- **Light Mode**: Clean, bright interface with subtle gradients
- **Dark Mode**: Rich, vibrant dark interface with enhanced glow effects
- **Automatic Detection**: Respects system preferences
- **Persistent Storage**: Remembers user's theme choice

### Components
- **Glass Cards**: Translucent cards with backdrop blur
- **Gradient Cards**: Vibrant gradient backgrounds with overlay effects
- **Neon Buttons**: Glowing buttons with ripple effects
- **Glass Buttons**: Translucent interactive buttons
- **Gradient Text**: Animated gradient text effects
- **Status Badges**: Colorful badges with glow options
- **Skeleton Loaders**: Shimmer loading animations
- **Theme Toggle**: Animated sun/moon switcher

## 🚀 Quick Start

### 1. Wrap your app with ThemeProvider

```javascript
import { ThemeProvider, GlobalStyles } from './theme';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Use the theme in components

```javascript
import styled from 'styled-components';

const MyComponent = styled.div`
  background: ${({ theme }) => theme.background.glass};
  color: ${({ theme }) => theme.text.primary};
  padding: ${({ theme }) => theme.spacing.lg};
`;
```

### 3. Use pre-built components

```javascript
import { GlassCard, NeonButton, GradientText } from './theme';

function MyPage() {
  return (
    <GlassCard>
      <h2>
        <GradientText $gradient="cosmic">
          Amazing Title
        </GradientText>
      </h2>
      <NeonButton $variant="primary" $size="lg">
        Click Me!
      </NeonButton>
    </GlassCard>
  );
}
```

### 4. Toggle theme programmatically

```javascript
import { useTheme } from './theme';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {isDark ? 'Dark' : 'Light'}
    </button>
  );
}
```

## 🎨 Theme Structure

### Colors
- **Primary**: Electric Purple (#7c3aed)
- **Secondary**: Hot Pink (#ec4899)
- **Accent**: Cyan (#06b6d4)
- **Status**: Success, Warning, Error, Info

### Gradients
- `primary`: Purple to violet
- `cosmic`: Pink to yellow
- `ocean`: Teal to pink
- `sunset`: Orange to pink
- `aurora`: Purple to pink
- `neon`: Hot pink to red

### Spacing Scale
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `xxl`: 3rem (48px)
- `xxxl`: 4rem (64px)

### Border Radius
- `sm`: 0.375rem
- `md`: 0.5rem
- `lg`: 0.75rem
- `xl`: 1rem
- `xxl`: 1.5rem
- `full`: 9999px

### Shadows
- Standard: `sm`, `md`, `lg`, `xl`, `xxl`
- Special: `glow`, `glowLg`, `neon`, `glass`
- Neon variants: `neonPink`, `neonCyan`

## 🎭 Component Props

### NeonButton
```javascript
<NeonButton
  $variant="primary" // primary | secondary | accent | gradient
  $size="md"        // sm | md | lg
>
  Button Text
</NeonButton>
```

### GlassCard
```javascript
<GlassCard
  $radius="lg"      // sm | md | lg | xl | xxl | full
  $padding="lg"     // xs | sm | md | lg | xl | xxl | xxxl
>
  Content
</GlassCard>
```

### GradientCard
```javascript
<GradientCard
  $gradient="cosmic" // primary | secondary | cosmic | ocean | sunset | aurora
  $radius="xl"
  $padding="xl"
>
  Content
</GradientCard>
```

### Badge
```javascript
<Badge
  $variant="success" // primary | secondary | success | warning | error | info
  $glow={true}      // Enable glow animation
>
  Badge Text
</Badge>
```

### GradientText
```javascript
<GradientText
  $gradient="primary" // Any gradient from theme
  $weight="bold"      // light | normal | medium | semibold | bold | extrabold
>
  Text
</GradientText>
```

## 🔧 Customization

### Extend the theme

```javascript
import { lightTheme, darkTheme } from './theme/theme';

const customLightTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#your-color',
  },
};
```

### Add custom animations

```javascript
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const AnimatedDiv = styled.div`
  animation: ${bounce} 2s infinite;
`;
```

## 🎯 Best Practices

1. **Use theme tokens**: Always reference theme values instead of hardcoding
2. **Consistent spacing**: Use the spacing scale for margins and padding
3. **Accessible colors**: Ensure sufficient contrast ratios
4. **Performance**: Use `backdrop-filter` sparingly on mobile
5. **Animations**: Respect `prefers-reduced-motion` for accessibility

## 🌈 Inspiration

This theme draws inspiration from:
- **Stripe**: Clean, modern design with subtle animations
- **Linear**: Bold gradients and smooth interactions
- **Vercel**: Minimalist aesthetics with powerful visuals
- **Glassmorphism**: Modern frosted glass UI trend
- **Neon aesthetics**: Cyberpunk-inspired glow effects

## 📦 Dependencies

- `styled-components` (^6.1.1): CSS-in-JS styling
- `framer-motion` (^10.16.5): Animation library

## 🎨 Color Palette

### Light Mode
- Background: Clean whites with subtle gradients
- Text: Dark grays for readability
- Accents: Vibrant purples, pinks, and cyans

### Dark Mode
- Background: Rich navy blues
- Text: Soft whites and light grays
- Accents: Enhanced neon glows and vibrant colors

## 🚀 Performance Tips

1. Use CSS variables for frequently changing values
2. Enable GPU acceleration with `will-change` for animations
3. Lazy load heavy components
4. Optimize backdrop-filter usage
5. Use `transform` and `opacity` for smooth animations

## 📝 License

Part of the Project Manager platform.

---

**Built with ❤️ using styled-components and framer-motion**

