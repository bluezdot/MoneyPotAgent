# Frontend Template

A modern React frontend template with TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 19** with TypeScript
- **Vite** (using rolldown-vite for faster builds)
- **React Router 7** for routing
- **TanStack Query** for server state management
- **Zustand** with Immer middleware for client state
- **Tailwind CSS 4** with shadcn/ui components
- **Sonner** for toast notifications

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

### 3. Other commands

```bash
pnpm build      # Type-check and build for production
pnpm preview    # Preview the production build locally
pnpm lint       # Run ESLint
```

## Deploy to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. Push your code to a GitHub or GitLab repository

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**

3. Select your repository and configure the build settings:
   - **Framework preset**: None
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or your project path if in a monorepo)

4. Add environment variable (if using pnpm):
   - **Variable name**: `PNPM_VERSION`
   - **Value**: `9` (or your preferred version)

5. Click **Save and Deploy**

Cloudflare will automatically deploy on every push to your main branch.

### Option 2: Direct Upload with Wrangler CLI

1. Install Wrangler globally:

```bash
pnpm add -g wrangler
```

1. Authenticate with Cloudflare:

```bash
wrangler login
```

1. Build your project:

```bash
pnpm build
```

1. Deploy to Cloudflare Pages:

```bash
wrangler pages deploy dist --project-name=your-project-name
```

### SPA Routing Configuration

For single-page apps with client-side routing, create a `public/_redirects` file:

```text
/*    /index.html   200
```

Or create a `public/_routes.json`:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/assets/*"]
}
```

## Project Structure

```text
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   └── layout/      # Layout components
├── pages/           # Page components
├── stores/          # Zustand stores
├── lib/             # Utility functions
└── main.tsx         # App entry point
```

## Adding UI Components

```bash
npx shadcn@latest add <component-name>
```

## Path Alias

Use `@/` to reference the `src/` directory:

```tsx
import { Button } from "@/components/ui/button"
```
