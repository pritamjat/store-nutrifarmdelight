# NutriFarm Delight - Next.js + MongoDB Authentication

This project now includes a complete authentication flow using:

- Next.js App Router
- MongoDB (`mongodb` driver)
- Password hashing with `bcryptjs`
- JWT-based sessions stored in an HttpOnly cookie

## Routes

- `/register` - create a user
- `/login` - authenticate user
- `/dashboard` - protected page

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
3. Update `.env.local` with your MongoDB connection string and JWT secret.
4. Run dev server:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.
