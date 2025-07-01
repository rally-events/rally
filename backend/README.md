# Rally Backend API

Express.js API server for the Rally event management platform.

## Features

- **Express.js** with TypeScript
- **Security middleware** (Helmet, CORS)
- **Error handling** with custom error types
- **Health check** endpoint
- **Database integration** via shared `@rally/db` package
- **Hot reload** with tsx

## Setup

1. **Install dependencies** (from repo root):

   ```bash
   pnpm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

The server will start on `http://localhost:3001`

## API Endpoints

- `GET /api/health` - Health check endpoint

## Environment Variables

| Variable       | Description           | Default                 |
| -------------- | --------------------- | ----------------------- |
| `PORT`         | Server port           | `3001`                  |
| `NODE_ENV`     | Environment           | `development`           |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `DATABASE_URL` | Supabase database URL | -                       |

## Development

- Add new routes in `src/routes/`
- Middleware goes in `src/middleware/`
- The shared database package is available as `@rally/db`

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm type-check` - Run TypeScript type checking
