# 🔐 Auth System – Clean Architecture API

This project implements a clean and scalable **authentication system** using:

- **Node.js + Express**
- **PostgreSQL + Prisma (multi-schema)**
- **Redis**
- **JWT-based auth (email/password)**
- **Google OAuth login**
- **Clean Architecture + Onion Architecture**

---

## 📁 Project Structure (Auth-Related Only)

```bash
my-app/
├── prisma/
│   └── schema.prisma              # Prisma schema with multi-schema setup
│
├── src/
│
│   ├── Domain/                    # Core business rules (no dependencies)
│   │   └── interfaces/
│   │       └── IUserRepository.ts
│
│   ├── Application/               # Use cases / business logic orchestration
│   │   └── useCases/
│   │       ├── RegisterUserUseCase.ts
│   │       └── LoginUserUseCase.ts
│
│   ├── Infrastructure/            # Implementations and integrations
│   │
│   │   ├── repositories/
│   │   │   └── PrismaUserRepository.ts
│   │
│   │   ├── endpoints/
│   │   │   └── auth.ts            # Routes for /auth/register, /login, /logout, /me
│   │
│   │   ├── middlewares/
│   │   │   └── withAuth.ts        # JWT-protected route wrapper
│   │
│   │   ├── auth_utils/
│   │   │   ├── jwt.ts             # JWT sign/verify helpers
│   │   │   ├── password.ts        # Hash/compare with bcrypt
│   │   │   └── googleStrategy.ts  # Passport strategy for Google OAuth
│   │
│   │   ├── db_utils/
│   │   │   └── redis.ts           # Redis client instance
│
│   ├── index.ts                   # App bootstrap: dotenv, middlewares, routes
│
├── .env                           # JWT secret, Redis URL, Google creds, etc.
├── tsconfig.json
├── package.json

```

## 🧪 Auth Features Implemented

### ✅ Email/Password Registration (`/auth/register`)

- Stores identity in `UserAccount` (in `public`)
- Stores hashed password in `UserCredential` (in `api_private` schema)
- Returns JWT

### ✅ Email/Password Login (`/auth/login`)

- Verifies email and hashed password
- Returns JWT

### ✅ Google OAuth (`/auth/google`)

- Uses Passport.js `passport-google-oauth20`
- Creates or reuses `UserAccount` with provider = `'google'`
- Returns JWT

### ✅ JWT-Protected Route (`/me`)

- Uses custom wrapper: `withAuth(handler)`
- Verifies `Authorization: Bearer <token>`
- Injects `req.user` from JWT payload

---

## 🔐 Auth Flow

### 🔸 Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass"
}
```

Returns

```bash
{ "token": "..." }
```

### 🔸 Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass"
}
```

Returns:

```bash
{ "token": "..." }
```

### 🔸 Google Login

1. /auth/google
2. OAuth callback: /auth/google/callback
3. Returns JWT as JSON

## 🛠 .env Configuration

```bash
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
JWT_SECRET=your-super-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

```

### 🔒 JWT Logout with Redis Blacklist

**🔚 Logging Out (POST /auth/logout)**

This project uses **Redis** to implement secure logout functionality in a stateless JWT-based auth system.

---

### ✅ Why a Token Blacklist?

Since JWTs are stateless and stored client-side, "logging out" requires server-side invalidation. We solve this by:

- Adding **used tokens to a Redis blacklist**
- Checking the blacklist on every request
- Setting the **TTL based on token expiration**

---

### 🧱 Redis Setup

1. **Install Redis:**

```bash
# macOS
brew install redis && brew services start redis

# or use Docker
docker run --name redis-auth -p 6379:6379 redis
```

Install Redis client:

```bash
npm install ioredis
```

## 🧱 Prisma Schema Notes

- Uses multi-schema preview feature:

- UserAccount → public schema

- UserCredential → api_private schema

## 🧠 Architecture Overview

```bash
src/
├── domain/         # Core models and interfaces
├── application/    # Use cases (business logic)
├── infrastructure/ # Express, Prisma, API key middleware, endpoints, repositories
Follows Onion/Clean Architecture for separation of concerns and testability.
```

## 👤 Author

#### Orestis Charalampakos

Software Engineer
