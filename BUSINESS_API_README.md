# Business Controller API Documentation

This document provides comprehensive information about the Business Controller endpoints for React frontend integration.

## Base URL
All endpoints are prefixed with `/business`

## Authentication
Most endpoints require a `user` header containing a JSON stringified object with the following structure:
```typescript
{
  uuid: string;      // User ID
  role: string;      // User role (e.g., 'worker', 'admin')
  iat: number;       // Token issued at timestamp
  exp: number;       // Token expiration timestamp
  business: string;  // Associated business ID
}
```

## Endpoints

### 1. Create Business
**POST** `/business`

Creates a new business and associates it with the authenticated user.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  name?: string;                    // Optional
  businessName: string;             // Required
  businessBrand: string;            // Required
  carHourCost: number;              // Required
  motorcycleHourCost: number;       // Required
  carMonthlyCost: number;           // Required
  motorcycleMonthlyCost: number;    // Required
  carDayCost: number;               // Required
  motorcycleDayCost: number;        // Required
  carNightCost: number;             // Required
  motorcycleNightCost: number;      // Required
  studentMotorcycleHourCost: number; // Required
  businessNit: string;              // Required
  businessResolution: string;       // Required
  address: string;                  // Required
  schedule: string;                 // Required
}
```

**Example Request:**
```typescript
const response = await fetch('/business', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    businessName: "Parking Solutions Inc",
    businessBrand: "ParkSol",
    carHourCost: 1000,
    motorcycleHourCost: 500,
    carMonthlyCost: 50000,
    motorcycleMonthlyCost: 25000,
    carDayCost: 8000,
    motorcycleDayCost: 4000,
    carNightCost: 6000,
    motorcycleNightCost: 3000,
    studentMotorcycleHourCost: 400,
    businessNit: "900123456-7",
    businessResolution: "RES-2024-001",
    address: "123 Main St, City",
    schedule: "24/7"
  })
});
```

**Response:**
```typescript
{
  _id: string;
  name?: string;
  userId: string;
  users: string[];
  businessName: string;
  businessBrand: string;
  carHourCost: number;
  motorcycleHourCost: number;
  carMonthlyCost: number;
  motorcycleMonthlyCost: number;
  carDayCost: number;
  motorcycleDayCost: number;
  carNightCost: number;
  motorcycleNightCost: number;
  studentMotorcycleHourCost: number;
  businessNit: string;
  businessResolution: string;
  address: string;
  schedule: string;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
}
```

**Error Responses:**
- `404 Not Found`: If user header is missing or invalid
- `400 Bad Request`: If validation fails (missing required fields)

---

### 2. Get User Business
**GET** `/business`

Retrieves business(es) for the authenticated user. Behavior depends on user role:
- If role is `'worker'` and `businessId` is provided: returns the specific business
- Otherwise: returns all businesses associated with the user

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Example:**
```typescript
const response = await fetch('/business', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
Returns an array of business objects (same structure as Create Business response)

```typescript
[
  {
    _id: string;
    name?: string;
    userId: string;
    users: string[];
    businessName: string;
    businessBrand: string;
    // ... all other business fields
    createdAt: string;
    updatedAt: string;
  }
]
```

**Error Responses:**
- `404 Not Found`: If user header is missing

---

### 3. Get All Businesses
**GET** `/business/all`

Retrieves all businesses in the system. No authentication required.

**Request Example:**
```typescript
const response = await fetch('/business/all', {
  method: 'GET'
});
```

**Response:**
Returns an array of all business objects.

```typescript
[
  {
    _id: string;
    name?: string;
    userId: string;
    users: string[];
    businessName: string;
    businessBrand: string;
    // ... all other business fields
    createdAt: string;
    updatedAt: string;
  }
]
```

---

### 4. Get My Businesses
**GET** `/business/my-businesses`

Retrieves all businesses associated with the authenticated user.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Example:**
```typescript
const response = await fetch('/business/my-businesses', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
Returns an array of business objects associated with the user.

```typescript
[
  {
    _id: string;
    name?: string;
    userId: string;
    users: string[];
    businessName: string;
    businessBrand: string;
    // ... all other business fields
    createdAt: string;
    updatedAt: string;
  }
]
```

**Error Responses:**
- `404 Not Found`: If user header is missing

---

### 5. Get Business by ID
**GET** `/business/:id`

Retrieves a specific business by its ID.

**Parameters:**
- `id` (path parameter): Business ID

**Request Example:**
```typescript
const businessId = '507f1f77bcf86cd799439011';
const response = await fetch(`/business/${businessId}`, {
  method: 'GET'
});
```

**Response:**
```typescript
{
  _id: string;
  name?: string;
  userId: string;
  users: string[];
  businessName: string;
  businessBrand: string;
  carHourCost: number;
  motorcycleHourCost: number;
  carMonthlyCost: number;
  motorcycleMonthlyCost: number;
  carDayCost: number;
  motorcycleDayCost: number;
  carNightCost: number;
  motorcycleNightCost: number;
  studentMotorcycleHourCost: number;
  businessNit: string;
  businessResolution: string;
  address: string;
  schedule: string;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `404 Not Found`: If business with the given ID doesn't exist

---

### 6. Update Business
**PATCH** `/business/:id`

Updates a business by ID. All fields are optional (partial update).

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Parameters:**
- `id` (path parameter): Business ID

**Request Body:**
All fields from CreateBusinessDto are optional (partial update):

```typescript
{
  name?: string;
  businessName?: string;
  businessBrand?: string;
  carHourCost?: number;
  motorcycleHourCost?: number;
  carMonthlyCost?: number;
  motorcycleMonthlyCost?: number;
  carDayCost?: number;
  motorcycleDayCost?: number;
  carNightCost?: number;
  motorcycleNightCost?: number;
  studentMotorcycleHourCost?: number;
  businessNit?: string;
  businessResolution?: string;
  address?: string;
  schedule?: string;
}
```

**Request Example:**
```typescript
const businessId = '507f1f77bcf86cd799439011';
const response = await fetch(`/business/${businessId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    businessName: "Updated Parking Solutions",
    carHourCost: 1200
  })
});
```

**Response:**
Returns the updated business object (same structure as Create Business response).

```typescript
{
  _id: string;
  name?: string;
  userId: string;
  users: string[];
  businessName: string;
  businessBrand: string;
  // ... all other business fields (updated)
  createdAt: string;
  updatedAt: string;
}
```

**Note:** This endpoint also updates the user's associated business to the specified business ID.

---

### 7. Delete Business
**DELETE** `/business/:id`

Deletes a business by ID.

**Parameters:**
- `id` (path parameter): Business ID

**Request Example:**
```typescript
const businessId = '507f1f77bcf86cd799439011';
const response = await fetch(`/business/${businessId}`, {
  method: 'DELETE'
});
```

**Response:**
Returns the deleted business object.

```typescript
{
  _id: string;
  name?: string;
  userId: string;
  users: string[];
  businessName: string;
  businessBrand: string;
  // ... all other business fields
  createdAt: string;
  updatedAt: string;
}
```

---

### 8. Set User to Business
**PATCH** `/business/:id/set-user`

Associates a user with a business (bidirectional relationship). Updates both the business and user records.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Parameters:**
- `id` (path parameter): Business ID

**Request Example:**
```typescript
const businessId = '507f1f77bcf86cd799439011';
const response = await fetch(`/business/${businessId}/set-user`, {
  method: 'PATCH',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
Returns the updated business object.

```typescript
{
  _id: string;
  name?: string;
  userId: string;  // Updated to current user's ID
  users: string[];
  businessName: string;
  businessBrand: string;
  // ... all other business fields
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `404 Not Found`: If user header is missing, business not found, or user not found

**Note:** This endpoint performs a bidirectional update:
- Sets the business's `userId` to the current user's ID
- Sets the user's `business` field to the business ID

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

// Business Entity
interface Business {
  _id: string;
  name?: string;
  userId: string;
  users: string[];
  businessName: string;
  businessBrand: string;
  carHourCost: number;
  motorcycleHourCost: number;
  carMonthlyCost: number;
  motorcycleMonthlyCost: number;
  carDayCost: number;
  motorcycleDayCost: number;
  carNightCost: number;
  motorcycleNightCost: number;
  studentMotorcycleHourCost: number;
  businessNit: string;
  businessResolution: string;
  address: string;
  schedule: string;
  createdAt: string;
  updatedAt: string;
}

// Create Business DTO
interface CreateBusinessDto {
  name?: string;
  businessName: string;
  businessBrand: string;
  carHourCost: number;
  motorcycleHourCost: number;
  carMonthlyCost: number;
  motorcycleMonthlyCost: number;
  carDayCost: number;
  motorcycleDayCost: number;
  carNightCost: number;
  motorcycleNightCost: number;
  studentMotorcycleHourCost: number;
  businessNit: string;
  businessResolution: string;
  address: string;
  schedule: string;
}

// Update Business DTO (all fields optional)
type UpdateBusinessDto = Partial<CreateBusinessDto>;
```

---

## Error Handling

All endpoints may return standard HTTP error responses:

- **400 Bad Request**: Validation errors (missing required fields, invalid data types)
- **404 Not Found**: Resource not found or user header missing
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

## Notes for React Integration

1. **User Header**: The `user` header must be a JSON stringified object. Make sure to stringify it before sending:
   ```typescript
   headers: {
     'user': JSON.stringify(userHeader)
   }
   ```

2. **CORS**: The API has CORS enabled, so you can make requests from any origin.

3. **Response Format**: All successful responses return JSON. Business objects include MongoDB `_id` fields and timestamps.

4. **Array Responses**: Several endpoints return arrays even for single results. Always handle as arrays in your React code.

5. **Partial Updates**: The update endpoint accepts partial data. Only send the fields you want to update.

