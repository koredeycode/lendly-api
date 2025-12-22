# Lendly API

Lendly API is a robust backend service built with **NestJS**, designed to power the Lendly platform—a peer-to-peer (P2P) marketplace for renting and giving away items. It facilitates secure transactions, item management, and user interactions, allowing users to monetize their belongings or help others in their community.

The system follows a **Clean Architecture** pattern and uses modern technologies for scalability, maintainability, and developer productivity.

## 🚀 Technologies

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Queue**: [BullMQ](https://bullmq.io/) (Redis)
- **Real-time**: Socket.IO (WebSockets)
- **Logging**: [Pino](https://github.com/pinojs/pino)
- **Validation**: Zod & class-validator
- **Documentation**: Swagger (OpenAPI)

## ✨ Key Features

- **Item Management**: Users can list items for rent (with daily rates) or for temporary/permanent giveaway.
- **Booking System**: Comprehensive flow for requesting, approving, and managing item rentals.
- **Wallet & Payments**: Integrated wallet system for handling rental fees, tips, and withdrawals (using Stripe/Payment Gateways).
- **User Profiles**: User authentication, profile management, and reputation tracking.
- **Messaging**: Real-time chat between lenders and borrowers to coordinate exchanges.
- **Reviews**: Reputation system allowing users to rate and review transactions.

## 🏗 Architecture

The project is structured into modular features located in `src/modules`. Each module follows a layered architecture to separate concerns:

- **Presentation**: Controllers and API endpoints (e.g., `item.controller.ts`).
- **Application**: Use cases and business logic orchestration.
- **Domain**: Core business entities and logic (e.g., `item.entity.ts`).
- **Infrastructure**: External implementations (repositories, database access).

### Core Modules

- `auth`: Authentication and authorization.
- `user`: User profile management.
- `item`: Listing items, photos, availability, and geolocation.
- `booking`: Rental request lifecycle (request, approve, return).
- `wallet`: Balance management, transactions, and payment integration.
- `message`: In-app chat functionality.
- `review`: User and item ratings.

## 🛠 Setup & Installation

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (for DB and Redis)
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lendly-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and update the values.
   ```bash
   cp .env.example .env
   ```

### Database Setup

1. Start the database and Redis containers (if using Docker):
   ```bash
   docker-compose up -d
   ```

2. Generate and migrate the database schema:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## 🏃‍♂️ Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:5000/api`.
Swagger documentation is available at `http://localhost:5000/api-docs`.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 API Response Format

All successful API responses follow this standard format:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

Errors are returned in this format:

```json
{
  "statusCode": 400,
  "timestamp": "2023-10-27T10:00:00.000Z",
  "path": "/api/resource",
  "message": "Error description",
  "error": "Bad Request"
}
```

## 📄 License

This project is [UNLICENSED](LICENSE).
