# WeatherNow

App que consulta uma API de clima e exibe temperatura, umidade e previsão do dia.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/              # Application configuration
├── pages/            # Page components
├── domain/           # Business domains
├── core/             # Shared components and utilities
└── assets/           # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router 6.26.2
- TanStack Query 5.59.20
- Axios 1.7.7
- Zustand 5.0.1