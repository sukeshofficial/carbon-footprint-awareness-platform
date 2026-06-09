# ACo2 - Authentication API Documentation

This document describes the API endpoints for the Authentication & Identity Management module.

## Base URL
`http://localhost:5000/api/v1/auth`

## Endpoints

### 1. Signup
Create a new user account.

- **URL**: `/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (201):
  ```json
  {
    "status": "success",
    "message": "Account created successfully",
    "data": { "user": { "id": "...", "name": "...", "email": "..." } }
  }
  ```

### 2. Login
Authenticate user and receive access token. Sets a `refreshToken` in an HTTP-only cookie.

- **URL**: `/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "user": { ... },
      "accessToken": "ey..."
    }
  }
  ```

### 3. Google OAuth
Initiates Google OAuth 2.0 flow.

- **URL**: `/google`
- **Method**: `GET`
- **Response**: Redirects to Google consent screen or returns a URL to redirect to.

### 4. Logout
Clear current session.

- **URL**: `/logout`
- **Method**: `POST`
- **Response** (200): Clears `refreshToken` cookie.

### 5. Forgot Password
Request a password reset link.

- **URL**: `/forgot-password`
- **Method**: `POST`
- **Body**: `{ "email": "john@example.com" }`

### 6. Reset Password
Set a new password using a token.

- **URL**: `/reset-password/:token`
- **Method**: `POST`
- **Body**: `{ "password": "NewPassword123!" }`

### 7. Get Current User
Retrieve profile of the logged-in user.

- **URL**: `/me`
- **Method**: `GET`
- **Auth**: `Bearer <accessToken>`
