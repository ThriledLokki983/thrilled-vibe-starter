# Vanilla Frontend Development Instructions

## Project Overview
Create a modern vanilla JavaScript frontend application with TypeScript, modern build tools, and comprehensive styling capabilities following the "HuisHelder" design aesthetic.

## Technology Stack

### Core Technologies
- **HTML5** - Semantic markup with accessibility in mind
- **TypeScript** - For type safety and better developer experience
- **CSS3** - Modern CSS with Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation
- **Vite** - Modern build tool and dev server
- **ESLint** + **Prettier** - Code quality and formatting

### Build & Development Tools
- **Vite** - Fast build tool with HMR
- **TypeScript Compiler** - Type checking and compilation
- **PostCSS** - CSS processing with autoprefixer
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting

### Package Management
- **npm** or **yarn** (prefer yarn for consistency)

## Project Structure

```
project-name/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── styles/
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   ├── typography.css
│   │   │   └── variables.css
│   │   ├── components/
│   │   ├── layouts/
│   │   └── main.css
│   ├── scripts/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── types/
│   │   └── main.ts
│   └── assets/
│       ├── images/
│       └── icons/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## Design System: "HuisHelder"

### Color Palette
```css
:root {
  /* Primary Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;

  /* Neutral Colors */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Typography
```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Spacing System
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### Border Radius & Shadows
```css
:root {
  /* Border Radius */
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

## Initial Setup

### 1. Project Initialization
```bash
# Create project directory
mkdir project-name && cd project-name

# Initialize package.json
yarn init -y

# Install Vite and TypeScript
yarn add -D vite typescript @types/node

# Install development tools
yarn add -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
yarn add -D @eslint/js eslint-config-prettier eslint-plugin-prettier
yarn add -D postcss autoprefixer
```

### 2. Configuration Files

**vite.config.ts**
```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
})
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.js",
    "lint:fix": "eslint src --ext .ts,.js --fix",
    "format": "prettier --write src/**/*.{ts,js,css,html}",
    "type-check": "tsc --noEmit"
  }
}
```

## Component Architecture

### Base Component Class
```typescript
// src/scripts/components/BaseComponent.ts
export abstract class BaseComponent {
  protected element: HTMLElement;
  
  constructor(selector: string | HTMLElement) {
    if (typeof selector === 'string') {
      const found = document.querySelector(selector);
      if (!found) throw new Error(`Element not found: ${selector}`);
      this.element = found as HTMLElement;
    } else {
      this.element = selector;
    }
    
    this.init();
  }
  
  protected abstract init(): void;
  
  protected bindEvents(): void {
    // Override in subclasses
  }
  
  public destroy(): void {
    // Cleanup logic
  }
}
```

### Example Component
```typescript
// src/scripts/components/Button.ts
import { BaseComponent } from './BaseComponent';

export class Button extends BaseComponent {
  private clickHandler?: (event: Event) => void;
  
  constructor(
    selector: string | HTMLElement,
    private options: {
      variant?: 'primary' | 'secondary' | 'outline';
      size?: 'sm' | 'md' | 'lg';
      onClick?: (event: Event) => void;
    } = {}
  ) {
    super(selector);
  }
  
  protected init(): void {
    this.applyStyles();
    this.bindEvents();
  }
  
  private applyStyles(): void {
    const { variant = 'primary', size = 'md' } = this.options;
    
    this.element.classList.add('btn', `btn--${variant}`, `btn--${size}`);
  }
  
  protected bindEvents(): void {
    if (this.options.onClick) {
      this.clickHandler = this.options.onClick;
      this.element.addEventListener('click', this.clickHandler);
    }
  }
  
  public destroy(): void {
    if (this.clickHandler) {
      this.element.removeEventListener('click', this.clickHandler);
    }
  }
}
```

## Styling Guidelines

### CSS Architecture
- Use CSS custom properties for theming
- Follow BEM methodology for class naming
- Use CSS Grid and Flexbox for layouts
- Implement responsive design with container queries when appropriate
- Use logical properties (margin-inline, padding-block, etc.)

### Component CSS Example
```css
/* src/styles/components/button.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  text-decoration: none;
  
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn--primary {
  background-color: var(--color-primary-600);
  color: white;
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-700);
  }
}

.btn--secondary {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-900);
  
  &:hover:not(:disabled) {
    background-color: var(--color-neutral-200);
  }
}

.btn--outline {
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: var(--color-primary-600);
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-50);
  }
}

.btn--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.btn--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
}
```

## JavaScript/TypeScript Patterns

### Module Organization
- Use ES6 modules
- Implement proper type definitions
- Create utility functions for common operations
- Use dependency injection for better testability

### Event Handling
```typescript
// src/scripts/utils/EventManager.ts
export class EventManager {
  private listeners: Map<string, Set<EventListener>> = new Map();
  
  public on(element: Element, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
    
    const key = this.getKey(element, event);
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(handler);
  }
  
  public off(element: Element, event: string, handler: EventListener): void {
    element.removeEventListener(event, handler);
    
    const key = this.getKey(element, event);
    const handlers = this.listeners.get(key);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(key);
      }
    }
  }
  
  public cleanup(): void {
    this.listeners.clear();
  }
  
  private getKey(element: Element, event: string): string {
    return `${element.tagName}-${event}`;
  }
}
```

## State Management

### Simple State Manager
```typescript
// src/scripts/utils/StateManager.ts
type StateListener<T> = (newState: T, prevState: T) => void;

export class StateManager<T> {
  private state: T;
  private listeners: Set<StateListener<T>> = new Set();
  
  constructor(initialState: T) {
    this.state = initialState;
  }
  
  public getState(): T {
    return { ...this.state };
  }
  
  public setState(updates: Partial<T>): void {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    this.listeners.forEach(listener => {
      listener(this.getState(), prevState);
    });
  }
  
  public subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

## Accessibility Requirements

### Core Principles
- Use semantic HTML elements
- Provide proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain color contrast ratios (4.5:1 minimum)
- Support screen readers
- Implement focus management

### Implementation
```typescript
// src/scripts/utils/A11yHelpers.ts
export class A11yHelpers {
  public static announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  public static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
}
```

## Performance Optimization

### Best Practices
- Use event delegation for dynamic content
- Implement virtual scrolling for large lists
- Lazy load images and content
- Minimize DOM queries
- Use Web Workers for heavy computations
- Implement service workers for caching

### Example: Lazy Loading
```typescript
// src/scripts/utils/LazyLoader.ts
export class LazyLoader {
  private observer: IntersectionObserver;
  
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { rootMargin: '50px' }
    );
  }
  
  public observe(element: HTMLElement): void {
    this.observer.observe(element);
  }
  
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const src = element.dataset.src;
        
        if (src && element instanceof HTMLImageElement) {
          element.src = src;
          element.removeAttribute('data-src');
          this.observer.unobserve(element);
        }
      }
    });
  }
}
```

## Testing Approach

### Unit Testing
- Use Jest or Vitest for unit tests
- Test component logic separately from DOM manipulation
- Mock external dependencies
- Aim for 80%+ code coverage

### Integration Testing
- Test component interactions
- Verify event handling
- Test state management
- Use Testing Library utilities

### E2E Testing
- Use Playwright or Cypress
- Test user workflows
- Verify accessibility features
- Test on multiple browsers

## Quality Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint configured and passing
- [ ] Prettier formatting applied
- [ ] No console.log statements in production
- [ ] Proper error handling implemented
- [ ] TypeScript interfaces defined for all data structures

### Performance
- [ ] Images optimized and lazy loaded
- [ ] CSS and JS minified for production
- [ ] No memory leaks (event listeners cleaned up)
- [ ] Efficient DOM queries
- [ ] Service worker implemented for caching

### Accessibility
- [ ] Semantic HTML structure
- [ ] ARIA labels where needed
- [ ] Keyboard navigation working
- [ ] Color contrast ratios met
- [ ] Screen reader tested
- [ ] Focus management implemented

### Design Consistency
- [ ] HuisHelder design system followed
- [ ] Consistent spacing using CSS custom properties
- [ ] Typography scale properly implemented
- [ ] Color palette consistently used
- [ ] Responsive design working on all devices

### Browser Support
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Progressive enhancement implemented
- [ ] Graceful degradation for older browsers
- [ ] Mobile-first responsive design

### Documentation
- [ ] README.md with setup instructions
- [ ] Code comments for complex logic
- [ ] API documentation for public methods
- [ ] Design system documentation
- [ ] Deployment instructions

## Deployment

### Build Process
```bash
# Production build
yarn build

# Preview production build
yarn preview
```

### Environment Setup
- Configure environment variables
- Set up CI/CD pipeline
- Configure hosting (Netlify, Vercel, etc.)
- Set up domain and SSL

This comprehensive guide ensures a modern, accessible, and maintainable vanilla JavaScript/TypeScript frontend application that follows industry best practices and the HuisHelder design aesthetic.
