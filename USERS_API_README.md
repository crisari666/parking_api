# Users Controller API Documentation

This document provides comprehensive information about the Users Controller endpoints for React frontend integration.

## Base URL
All endpoints are prefixed with `/users`

## Authentication
Most endpoints require a `user` header containing a JSON stringified object with the following structure:
```typescript
{
  uuid: string;      // User ID
  role: string;      // User role: 'admin', 'user', or 'worker'
  iat: number;       // Token issued at timestamp
  exp: number;       // Token expiration timestamp
  business: string;  // Associated business ID
}
```

## User Roles
The system supports three user roles:
- **admin**: Full access, can create users, update roles, manage businesses
- **user**: Can create and manage workers within their business
- **worker**: Limited access, cannot create or manage other users

## Endpoints

### 1. Create User (Admin Only)
**POST** `/users/create`

Creates a new user. Only accessible by admin users.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  user: string;      // Required - Username/email
  password: string;  // Required
}
```

**Example Request:**
```typescript
const response = await fetch('/users/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    user: "admin@example.com",
    password: "securePassword123"
  })
});
```

**Response:**
```typescript
{
  _id: string;
  user: string;
  email: string;        // Set to lowercase version of user
  password: string;     // Hashed password
  business?: string;
  name: string;
  lastName: string;
  role: UserRole;       // Default: 'user'
  enabled: boolean;     // Default: true
  createdAt: string;    // ISO date string
  updatedAt: string;    // ISO date string
}
```

**Error Responses:**
- `403 Forbidden`: If user is not an admin or user header is missing
- `400 Bad Request`: If validation fails (missing required fields)

---

### 2. Create User by User
**POST** `/users/create-by-user`

Creates a new worker user. Only accessible by users with 'user' role (not 'worker' role). The new user will be associated with the creator's business and assigned the 'worker' role.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  email: string;       // Required - Must be a valid email
  password: string;    // Required
}
```

**Example Request:**
```typescript
const response = await fetch('/users/create-by-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    email: "worker@example.com",
    password: "securePassword123"
  })
});
```

**Response:**
Returns the created user (password excluded):

```typescript
{
  _id: string;
  user: string;        // Set to email
  email: string;
  business: string;    // Set to creator's business
  name: string;        // Default: ''
  lastName: string;    // Default: ''
  role: 'worker';      // Always set to 'worker'
  enabled: boolean;    // Default: true
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `403 Forbidden`: If user is a worker or user header is missing
- `400 Bad Request`: If validation fails (invalid email, missing fields)

---

### 3. Get All Users
**GET** `/users`

Retrieves all users in the system. Passwords are excluded from the response.

**Request Example:**
```typescript
const response = await fetch('/users', {
  method: 'GET'
});
```

**Response:**
Returns an array of user objects (passwords excluded):

```typescript
[
  {
    _id: string;
    user: string;
    email: string;
    business?: string;
    name: string;
    lastName: string;
    role: UserRole;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
  }
]
```

---

### 4. Get Users by Business ID
**GET** `/users/business/:businessId`

Retrieves all users associated with a specific business. Passwords are excluded from the response.

**Parameters:**
- `businessId` (path parameter): Business ID

**Request Example:**
```typescript
const businessId = '507f1f77bcf86cd799439011';
const response = await fetch(`/users/business/${businessId}`, {
  method: 'GET'
});
```

**Response:**
Returns an array of user objects associated with the business:

```typescript
[
  {
    _id: string;
    user: string;
    email: string;
    business: string;
    name: string;
    lastName: string;
    role: UserRole;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
  }
]
```

---

### 5. Get Users by My Business
**GET** `/users/my-business`

Retrieves all users associated with the authenticated user's business. Passwords are excluded from the response.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Example:**
```typescript
const response = await fetch('/users/my-business', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
Returns an array of user objects:

```typescript
[
  {
    _id: string;
    user: string;
    email: string;
    business: string;
    name: string;
    lastName: string;
    role: UserRole;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
  }
]
```

**Error Responses:**
- `403 Forbidden`: If user header is missing or user is not associated with a business

---

### 6. Get User by ID
**GET** `/users/:id`

Retrieves a user by ID. **Note:** This endpoint appears to be incomplete and currently returns a string template.

**Parameters:**
- `id` (path parameter): User ID (number)

**Request Example:**
```typescript
const userId = 123;
const response = await fetch(`/users/${userId}`, {
  method: 'GET'
});
```

**Response:**
Currently returns a string: `"This action returns a #${id} user"`

**Note:** This endpoint may need to be implemented properly in the backend.

---

### 7. Update User (Admin Only)
**PATCH** `/users/:id`

Updates a user. Only accessible by admin users.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Parameters:**
- `id` (path parameter): User ID

**Request Body:**
All fields are optional (partial update):

```typescript
{
  user?: string;
  password?: string;
  role?: UserRole;  // 'admin', 'user', or 'worker'
}
```

**Example Request:**
```typescript
const userId = '507f1f77bcf86cd799439011';
const response = await fetch(`/users/${userId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    role: 'admin'
  })
});
```

**Response:**
Returns the updated user object (password excluded):

```typescript
{
  _id: string;
  user: string;
  email: string;
  business?: string;
  name: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `403 Forbidden`: If user is not an admin or user header is missing

**Note:** If password is provided, it will be hashed before storage.

---

### 8. Update User Role (Admin Only)
**PATCH** `/users/:id/role`

Updates a user's role. Only accessible by admin users.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Parameters:**
- `id` (path parameter): User ID

**Request Body:**
```typescript
{
  role: UserRole;  // Required: 'admin', 'user', or 'worker'
}
```

**Example Request:**
```typescript
const userId = '507f1f77bcf86cd799439011';
const response = await fetch(`/users/${userId}/role`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    role: 'admin'
  })
});
```

**Response:**
Returns the updated user object (password excluded):

```typescript
{
  _id: string;
  user: string;
  email: string;
  business?: string;
  name: string;
  lastName: string;
  role: UserRole;  // Updated role
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `403 Forbidden`: If user is not an admin or user header is missing
- `400 Bad Request`: If role is invalid

---

### 9. Update User Status
**PATCH** `/users/:id/status`

Updates a user's enabled/disabled status. Accessible by admin or user roles (not worker).

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Parameters:**
- `id` (path parameter): User ID

**Request Body:**
```typescript
{
  enabled: boolean;  // Required
}
```

**Example Request:**
```typescript
const userId = '507f1f77bcf86cd799439011';
const response = await fetch(`/users/${userId}/status`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    enabled: false
  })
});
```

**Response:**
Returns the updated user object (password excluded):

```typescript
{
  _id: string;
  user: string;
  email: string;
  business?: string;
  name: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;  // Updated status
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `403 Forbidden`: If user is a worker or user header is missing
- `400 Bad Request`: If enabled field is missing or invalid

---

### 10. Update User by User
**PATCH** `/users/:id/update-by-user`

Updates a worker user's email and/or password. Only accessible by users with 'user' role (not 'worker'). Can only update users that:
- Belong to the same business as the updater
- Have the 'worker' role

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Parameters:**
- `id` (path parameter): User ID to update

**Request Body:**
All fields are optional:

```typescript
{
  email?: string;     // Must be a valid email if provided
  password?: string;
}
```

**Example Request:**
```typescript
const userId = '507f1f77bcf86cd799439011';
const response = await fetch(`/users/${userId}/update-by-user`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    email: "newemail@example.com",
    password: "newPassword123"
  })
});
```

**Response:**
Returns the updated user object (password excluded):

```typescript
{
  _id: string;
  user: string;        // Updated to match email if email was changed
  email: string;       // Updated email (lowercased)
  business: string;
  name: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `403 Forbidden`: If user is a worker, user header is missing, user doesn't belong to same business, or user is not a worker
- `404 Not Found`: If user to update is not found
- `400 Bad Request`: If validation fails

**Note:** 
- If email is updated, both `email` and `user` fields are updated to the lowercase email
- If password is provided, it will be hashed before storage

---

### 11. Update User Business (Admin Only)
**PATCH** `/users/:id/business`

Updates a user's associated business. Only accessible by admin users.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Parameters:**
- `id` (path parameter): User ID

**Request Body:**
```typescript
{
  business: string;  // Required - Valid MongoDB ObjectId
}
```

**Example Request:**
```typescript
const userId = '507f1f77bcf86cd799439011';
const response = await fetch(`/users/${userId}/business`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    business: '507f1f77bcf86cd799439012'
  })
});
```

**Response:**
Returns the updated user object (password excluded):

```typescript
{
  _id: string;
  user: string;
  email: string;
  business: string;  // Updated business ID
  name: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `403 Forbidden`: If user is not an admin or user header is missing
- `404 Not Found`: If user is not found
- `400 Bad Request`: If business ID is invalid

---

## TypeScript Interfaces for React

For your React application, you can use these TypeScript interfaces:

```typescript
// User Header (for authentication)
interface UserHeader {
  uuid: string;
  role: string;
  iat: number;
  exp: number;
  business: string;
}

// User Role Enum
enum UserRole {
  admin = 'admin',
  user = 'user',
  worker = 'worker'
}

// User Entity (password never included in responses)
interface User {
  _id: string;
  user: string;
  email: string;
  business?: string;
  name: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create User DTO (Admin)
interface CreateUserDto {
  user: string;
  password: string;
}

// Create User by User DTO
interface CreateUserByUserDto {
  email: string;
  password: string;
}

// Update User DTO (Admin)
interface UpdateUserDto {
  user?: string;
  password?: string;
  role?: UserRole;
}

// Update User Role DTO
interface UpdateUserRoleDto {
  role: UserRole;
}

// Update User Status DTO
interface UpdateUserStatusDto {
  enabled: boolean;
}

// Update User by User DTO
interface UpdateUserByUserDto {
  email?: string;
  password?: string;
}

// Update User Business DTO
interface UpdateUserBusinessDto {
  business: string;
}
```

---

## Error Handling

All endpoints may return standard HTTP error responses:

- **400 Bad Request**: Validation errors (missing required fields, invalid data types, invalid email format)
- **403 Forbidden**: Permission denied (insufficient role, user header missing, business mismatch)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

Example error response structure:
```typescript
{
  statusCode: number;
  message: string | string[];
  error?: string;
}
```

---

## Role-Based Access Control Summary

| Endpoint | Admin | User | Worker |
|----------|-------|------|--------|
| POST `/users/create` | ✅ | ❌ | ❌ |
| POST `/users/create-by-user` | ✅ | ✅ | ❌ |
| GET `/users` | ✅ | ✅ | ✅ |
| GET `/users/business/:businessId` | ✅ | ✅ | ✅ |
| GET `/users/my-business` | ✅ | ✅ | ✅ |
| GET `/users/:id` | ✅ | ✅ | ✅ |
| PATCH `/users/:id` | ✅ | ❌ | ❌ |
| PATCH `/users/:id/role` | ✅ | ❌ | ❌ |
| PATCH `/users/:id/status` | ✅ | ✅ | ❌ |
| PATCH `/users/:id/update-by-user` | ✅ | ✅ | ❌ |
| PATCH `/users/:id/business` | ✅ | ❌ | ❌ |

---

## Notes for React Integration

1. **User Header**: The `user` header must be a JSON stringified object. Make sure to stringify it before sending:
   ```typescript
   headers: {
     'user': JSON.stringify(userHeader)
   }
   ```

2. **Password Security**: 
   - Passwords are never returned in responses (excluded via `.select('-password')`)
   - Passwords are hashed on the server before storage
   - Never send passwords in GET requests or log them

3. **Email Normalization**: Email addresses are automatically converted to lowercase on the server

4. **Business Association**: 
   - When creating users via `/users/create-by-user`, they are automatically associated with the creator's business
   - Workers can only be updated if they belong to the same business as the updater

5. **Role Validation**: 
   - Always check user role before allowing access to role-specific endpoints
   - Workers have the most restricted access

6. **User Status**: The `enabled` field controls whether a user can access the system. Disabled users should be prevented from logging in on the frontend.

7. **Array Responses**: Several endpoints return arrays. Always handle as arrays in your React code.

8. **Partial Updates**: Most update endpoints accept partial data. Only send the fields you want to update.

9. **Business Filtering**: When displaying users, filter by the current user's business if they are not an admin.

