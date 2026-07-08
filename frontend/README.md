# NudiCodex Frontend

React + TypeScript frontend for NudiCodex — a field-guide "Pokédex" of nudibranchs and sea slugs.

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript (strict mode)
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Recharts** - Data visualization
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- **Node.js 18+**
- **npm** or **yarn** or **pnpm**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set up Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 📝 Available Scripts

### Development
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
```

### Code Quality
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run type-check    # Run TypeScript type checking
```

### Testing
```bash
npm run test          # Run tests with Vitest
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services (Axios)
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── .eslintrc.cjs       # ESLint configuration
├── .prettierrc.json    # Prettier configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## ⚙️ Configuration

### TypeScript (Strict Mode)

The project uses TypeScript with **strict mode enabled** for maximum type safety:

- ✅ `strict: true`
- ✅ `noUnusedLocals: true`
- ✅ `noUnusedParameters: true`
- ✅ `noFallthroughCasesInSwitch: true`
- ✅ `noImplicitReturns: true`
- ✅ `noUncheckedIndexedAccess: true`
- ✅ `exactOptionalPropertyTypes: true`

### Path Aliases

Configure path aliases in `tsconfig.json`:

```typescript
import Button from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'
```

Available aliases:
- `@/*` - src directory
- `@/components/*`
- `@/pages/*`
- `@/hooks/*`
- `@/utils/*`
- `@/services/*`
- `@/store/*`
- `@/types/*`

### ESLint

ESLint is configured with:
- TypeScript support
- React hooks rules
- Prettier integration
- Custom rules for code quality

Run linting:
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Prettier

Prettier is configured for consistent code formatting:
- No semicolons
- Single quotes
- 100 character line width
- 2 space indentation
- Trailing commas in ES5

Format code:
```bash
npm run format
npm run format:check
```

## 🎨 Development Guidelines

### Component Structure

```tsx
import type { FC } from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {label}
    </button>
  )
}
```

### API Services (Axios)

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
})

// Add interceptors for auth, error handling, etc.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api }
```

### Data Fetching (TanStack Query)

```tsx
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export const useSpecies = () => {
  return useQuery({
    queryKey: ['species'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/species')
      return data
    },
  })
}

// Usage in component
const { data, isLoading, error } = useSpecies()
```

### State Management (Zustand)

```typescript
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

### Routing (React Router)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { IdentifyPage } from '@/pages/IdentifyPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/identify" element={<IdentifyPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## 🔧 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=NudiCodex
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 🎯 Code Quality Standards

### Before Committing

Always run:
```bash
npm run type-check  # Check TypeScript types
npm run lint:fix    # Fix linting issues
npm run format      # Format code
npm run test        # Run tests
```

### Type Safety

- Always define proper types/interfaces
- Avoid using `any` type
- Use type imports: `import type { FC } from 'react'`
- Enable strict null checks

### Component Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for expensive components
- Implement proper loading and error states
- Keep components small and focused

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

The build output will be in the `dist/` directory.

### Build Optimization

- Code splitting with React.lazy
- Tree shaking
- Asset optimization
- Minification

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

## 🔍 Troubleshooting

### ESLint Errors

```bash
# Clear ESLint cache
rm -rf node_modules/.cache

# Fix all auto-fixable issues
npm run lint:fix
```

### TypeScript Errors

```bash
# Check all type errors
npm run type-check

# Clear TypeScript cache
rm -rf node_modules/.cache/typescript
```

### Module Resolution Issues

If you encounter module resolution issues with path aliases:

1. Restart your IDE/editor
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the dist/ directory
```

### Docker

```bash
# Build and run with Docker
docker build -t nudibranchid-frontend .
docker run -p 3000:3000 nudibranchid-frontend
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React Router](https://reactrouter.com/)
- [Recharts Documentation](https://recharts.org/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run code quality checks
4. Submit a pull request

## 📄 License

[Your License Here]
