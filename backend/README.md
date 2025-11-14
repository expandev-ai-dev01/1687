# WeatherNow Backend API

Backend API for WeatherNow - Weather information service application.

## Description

App que consulta uma API de clima e exibe temperatura, umidade e previsão do dia.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Architecture**: REST API

## Project Structure

```
src/
├── api/                    # API controllers
│   └── v1/                 # API Version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic
├── utils/                  # Utility functions
├── constants/              # Application constants
├── config/                 # Configuration
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Production

Start production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - API health status

### API Version 1
Base URL: `/api/v1`

#### External (Public) Endpoints
- Feature endpoints will be added here

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `WEATHER_API_KEY` - External weather API key
- `WEATHER_API_URL` - External weather API URL

## Features

- [x] Base project structure
- [x] Express server configuration
- [x] API versioning support
- [x] Error handling middleware
- [x] CORS configuration
- [x] Security middleware (Helmet)
- [x] Response compression
- [ ] Weather data endpoints (to be implemented)

## Development Guidelines

- Follow TypeScript strict mode
- Use path aliases (@/) for imports
- Implement proper error handling
- Write comprehensive TSDoc comments
- Follow RESTful API conventions
- Maintain separation of concerns

## License

ISC