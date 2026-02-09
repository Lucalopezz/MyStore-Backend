# API Store NestJS
This application is a RESTful API developed with **NestJS**, using **PostgreSQL** as the database and **Prisma** as the ORM. The API includes JWT authentication, role-based permission control (user and admin), a logging system (Winston), and interactive documentation via Swagger.

## Features
- **User CRUD**:
  - Each user has a role (`USER` or `ADMIN`).
  - Only an `ADMIN` can delete users and create products.
- **Product CRUD**:
  - Any user can view products.
  - Only users with the `ADMIN` role can create, update, or delete products.
- **Authentication and Authorization**:
  - Registration of new users.
  - Login of existing users to obtain JWT token.
  - Route protection based on user role.
- **Payment System**:
  - Creates a session with Stripe for payments.
- **Logging System**:
  - Activity and error logging using Winston.
- **API Documentation**:
  - Interactive documentation available via Swagger.

## Technologies
- **NestJS**, **PostgreSQL**, **Prisma**, **JWT**, **Winston**, **Zod**, **Swagger**, **Stripe**.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Lucalopezz/api-loja-nestjs.git
   cd api-loja-nestjs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the database:
   - Create a PostgreSQL database.
   - Add to the `.env` file:
     ```
     DATABASE_URL=postgresql://user:password@localhost:5432/database_name
     ```
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run start:dev
   ```
The application will be available at `http://localhost:3000`.

## Basic Usage
- **Registration**: `POST /auth/register`
  ```json
  { "email": "user@example.com", "password": "password123", "name": "User Name" }
  ```
- **Login**: `POST /auth/login`
  ```json
  { "email": "user@example.com", "password": "password123" }
  ```
  **Response**:
  ```json
  { "access_token": "jwt_token" }
  ```
- **Swagger**: Access `http://localhost:3000/docs`.

## Project Structure
- **src/**:
  - **auth/**: Authentication module.
  - **payment/**: Payment module with Stripe.
  - **users/**: User CRUD.
  - **products/**: Product CRUD.
  - **common/**: Guards, interceptors, and utils.
  - **main.ts**: Main entry point.
