# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Type-check with tsc and build with Vite
pnpm lint       # Run ESLint
pnpm preview    # Preview production build
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** (using rolldown-vite for faster builds)
- **React Router 7** for routing
- **TanStack Query** for server state management
- **Zustand** with Immer middleware for client state management
- **Tailwind CSS 4** with shadcn/ui components (new-york style)
- **Sonner** for toast notifications

## Architecture

### Path Alias

Use `@/` to reference `src/` directory (e.g., `@/components/ui/button`).

### State Management

- **Server state**: Use TanStack Query hooks (`useQuery`, `useMutation`)
- **Client state**: Zustand stores in `src/stores/` with Immer for immutable updates and persist middleware for localStorage

### Component Patterns

- UI primitives in `src/components/ui/` (shadcn/ui components)
- Layout components in `src/components/layout/`
- Pages in `src/pages/`
- Use `cn()` from `@/lib/utils` to merge Tailwind classes

### Adding UI Components

```bash
npx shadcn@latest add <component-name>
```

Components use lucide-react for icons.
