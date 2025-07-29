# 🔐 Auth System – Clean Architecture API

This project implements a clean and scalable **authentication system** using:

- **Node.js + Express**
- **PostgreSQL + Prisma (multi-schema)**
- **JWT-based auth (email/password)**
- **Google OAuth login**
- **Clean Architecture + Onion Architecture**

---

## 📁 Project Structure (Auth-Related Only)

```bash
src/
├── Domain/
│ └── interfaces/
│ └── IUserRepository.ts
│
├── Application/
│ └── usecases/
│ ├── RegisterUserUseCase.ts
│ └── LoginUserUseCase.ts
│
├── Infrastructure/
│ ├── auth_utils/
│ │ ├── jwtAuth.ts
│ │ └── password.ts
│ │
│ ├── middlewares/
│ │ └── withAuth.ts
│ │
│ ├── endpoints/
│ │ └── auth.ts
│ │
│ └── repositories/
│ └── PrismaUserRepository.ts
│
├── index.ts
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
