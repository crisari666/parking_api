# Vehicle & Vehicle Log Controller API Documentation

This document provides comprehensive information about the Vehicle and Vehicle Log Controller endpoints for React frontend integration.

## Base URLs
- Vehicle endpoints are prefixed with `/vehicle`
- Vehicle Log endpoints are prefixed with `/vehicle-log`

## Authentication
All endpoints require a `user` header containing a JSON stringified object with the following structure:
```typescript
{
  uuid: string;      // User ID
  role: string;      // User role: 'admin', 'user', or 'worker'
  iat: number;       // Token issued at timestamp
  exp: number;       // Token expiration timestamp
  business: string;  // Associated business ID
}
```

## Vehicle Type Enum
The system supports two vehicle types:
- **car**: Standard car
- **motorcycle**: Motorcycle

---

# Vehicle Controller Endpoints

## 1. Create Vehicle
**POST** `/vehicle`

Creates a new vehicle or updates an existing vehicle's type if it already exists with the same plate number and business ID.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  plateNumber: string;    // Required - License plate number (will be converted to uppercase)
  vehicleType: VehicleType; // Required - 'car' or 'motorcycle'
}
```

**Example Request:**
```typescript
const response = await fetch('/vehicle', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    plateNumber: "ABC123",
    vehicleType: "car"
  })
});
```

**Response:**
```typescript
{
  _id: string;
  plateNumber: string;      // Uppercase
  vehicleType: VehicleType;
  inParking: boolean;        // Default: false
  lastLog: string;           // ISO date string
  businessId: string;
  userName: string;          // Default: ''
  phone: string;             // Default: ''
  createdAt: string;         // ISO date string
  updatedAt: string;         // ISO date string
}
```

**Error Responses:**
- `400 Bad Request`: If validation fails (missing required fields, invalid vehicle type)
- `401 Unauthorized`: If user header is missing or invalid

---

## 2. Get All Vehicles (by Business)
**GET** `/vehicle`

Returns all vehicles associated with the user's business.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<{
  _id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  inParking: boolean;
  lastLog: string;
  businessId: string;
  userName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}>
```

---

## 3. Get Vehicles by Business ID
**GET** `/vehicle/business/:businessId`

Returns all vehicles for a specific business ID.

**Path Parameters:**
- `businessId` (string): The business ID

**Example Request:**
```typescript
const response = await fetch(`/vehicle/business/${businessId}`, {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<Vehicle>
```

---

## 4. Get User's Vehicles
**GET** `/vehicle/my-vehicles`

Returns all vehicles associated with the current user.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle/my-vehicles', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<Vehicle>
```

---

## 5. Get Active Vehicles
**GET** `/vehicle/active`

Returns all vehicles currently in parking for the user's business.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle/active', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<Vehicle> // Only vehicles where inParking: true
```

---

## 6. Find Vehicle by Plate Number (Business Scoped)
**GET** `/vehicle/plate/:plateNumber`

Finds a vehicle by plate number within the user's business.

**Path Parameters:**
- `plateNumber` (string): The license plate number (case-insensitive, converted to uppercase)

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle/plate/ABC123', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Vehicle | null
```

---

## 7. Find All Vehicles by Plate Number (All Businesses)
**GET** `/vehicle/plate/:plateNumber/all`

Finds all vehicles with the given plate number across all businesses.

**Path Parameters:**
- `plateNumber` (string): The license plate number (case-insensitive, converted to uppercase)

**Example Request:**
```typescript
const response = await fetch('/vehicle/plate/ABC123/all', {
  method: 'GET'
});
```

**Response:**
```typescript
Array<Vehicle>
```

---

## 8. Get Unique Business IDs
**GET** `/vehicle/business-ids`

Returns an array of all unique business IDs that have vehicles.

**Example Request:**
```typescript
const response = await fetch('/vehicle/business-ids', {
  method: 'GET'
});
```

**Response:**
```typescript
string[] // Array of business ID strings
```

---

## 9. Set Parking Status
**PATCH** `/vehicle/plate/:plateNumber/parking`

Updates the parking status (in/out) for a vehicle by plate number.

**Path Parameters:**
- `plateNumber` (string): The license plate number (case-insensitive, converted to uppercase)

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  parking: boolean; // true = in parking, false = out of parking
}
```

**Example Request:**
```typescript
const response = await fetch('/vehicle/plate/ABC123/parking', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    parking: true
  })
});
```

**Response:**
```typescript
Vehicle // Updated vehicle object
```

---

## 10. Get Vehicle by ID
**GET** `/vehicle/:id`

Gets a specific vehicle by ID within the user's business.

**Path Parameters:**
- `id` (string): The vehicle ID

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch(`/vehicle/${vehicleId}`, {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Vehicle | null
```

---

## 11. Update Vehicle
**PATCH** `/vehicle/:id`

Updates a vehicle's information.

**Path Parameters:**
- `id` (string): The vehicle ID

**Request Body:**
```typescript
{
  plateNumber?: string;
  vehicleType?: VehicleType;
}
```

**Example Request:**
```typescript
const response = await fetch(`/vehicle/${vehicleId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    vehicleType: "motorcycle"
  })
});
```

**Response:**
```typescript
Vehicle // Updated vehicle object
```

---

## 12. Delete Vehicle
**DELETE** `/vehicle/:id`

Deletes a vehicle by ID.

**Path Parameters:**
- `id` (string): The vehicle ID

**Example Request:**
```typescript
const response = await fetch(`/vehicle/${vehicleId}`, {
  method: 'DELETE',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Vehicle // Deleted vehicle object
```

---

## 13. Delete All Vehicles by Business
**DELETE** `/vehicle/business/:businessId`

Deletes all vehicles associated with a specific business.

**Path Parameters:**
- `businessId` (string): The business ID

**Example Request:**
```typescript
const response = await fetch(`/vehicle/business/${businessId}`, {
  method: 'DELETE',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
{
  acknowledged: boolean;
  deletedCount: number;
}
```

---

# Vehicle Log Controller Endpoints

## 1. Create Vehicle Log (Entry)
**POST** `/vehicle-log`

Creates a new vehicle log entry when a vehicle enters the parking. Automatically creates the vehicle if it doesn't exist. Checks for active membership and applies appropriate logic.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  plateNumber: string;    // Required - License plate number (will be converted to uppercase)
  vehicleType: VehicleType; // Required - 'car' or 'motorcycle'
}
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    plateNumber: "ABC123",
    vehicleType: "car"
  })
});
```

**Response (with membership):**
```typescript
{
  _id: string;
  vehicleId: string;
  businessId: string;
  entryTime: string;        // ISO date string
  exitTime: null;
  duration: number;          // 0
  cost: number;              // 0
  paymentMethod: null;
  hasMembership: true;
  membershipId: string;
  vehicleType: VehicleType;
  message: "Vehicle has active membership - no charge applied";
  createdAt: string;
  updatedAt: string;
}
```

**Response (without membership):**
```typescript
{
  _id: string;
  vehicleId: string;
  businessId: string;
  entryTime: string;
  exitTime: null;
  duration: number;          // 0
  cost: number;              // 0
  paymentMethod: null;
  hasMembership: false;
  membershipId: null;
  vehicleType: VehicleType;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `400 Bad Request`: If vehicle is already in parking, or validation fails
- `401 Unauthorized`: If user header is missing or invalid

---

## 2. Get All Vehicle Logs (by Business)
**GET** `/vehicle-log`

Returns all vehicle logs for the user's business.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<{
  _id: string;
  vehicleId: {
    _id: string;
    plateNumber: string;
    vehicleType: VehicleType;
  };
  businessId: string;
  entryTime: string;
  exitTime: string | null;
  duration: number;
  cost: number;
  paymentMethod: PaymentMethod | null;
  hasMembership: boolean;
  membershipId: string | null;
  message: string; // "Vehicle has active membership - no charge applied" or "Vehicle charged based on parking duration"
  createdAt: string;
  updatedAt: string;
}>
```

---

## 3. Get Active Vehicles (Vehicle Logs)
**GET** `/vehicle-log/active`

Returns all active vehicle logs (vehicles currently in parking) for the user's business.

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log/active', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<{
  _id: string;
  vehicleId: {
    _id: string;
    plateNumber: string;
    vehicleType: VehicleType;
  };
  businessId: string;
  entryTime: string;
  exitTime: null;
  duration: number;          // Calculated in minutes
  cost: number;
  paymentMethod: PaymentMethod | null;
  hasMembership: boolean;
  membershipId: string | null;
  message: string; // "Vehicle has active membership - no charge will be applied" or "Vehicle will be charged based on parking duration"
  createdAt: string;
  updatedAt: string;
}>
```

---

## 4. Update Business ID (Bulk)
**PATCH** `/vehicle-log/update-business-id`

Updates the business ID for all vehicles and vehicle logs from one business to another. This is a bulk operation.

**Request Body:**
```typescript
{
  from: string;  // Required - MongoDB ObjectId of source business
  to: string;    // Required - MongoDB ObjectId of target business
}
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log/update-business-id', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    from: "507f1f77bcf86cd799439011",
    to: "507f191e810c19729de860ea"
  })
});
```

**Response:**
```typescript
{
  message: "Business ID updated successfully";
  vehiclesUpdated: number;
  vehicleLogsUpdated: number;
  from: string;
  to: string;
}
```

**Error Responses:**
- `400 Bad Request`: If business IDs are invalid MongoDB ObjectIds

---

## 5. Get Vehicle Log by ID
**GET** `/vehicle-log/:id`

Gets a specific vehicle log by ID within the user's business.

**Path Parameters:**
- `id` (string): The vehicle log ID

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch(`/vehicle-log/${logId}`, {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
{
  _id: string;
  vehicleId: Vehicle;        // Full vehicle object
  businessId: string;
  entryTime: string;
  exitTime: string | null;
  duration: number;
  cost: number;
  paymentMethod: PaymentMethod | null;
  hasMembership: boolean;
  membershipId: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `404 Not Found`: If vehicle log is not found

---

## 6. Update Vehicle Log
**PATCH** `/vehicle-log/:id`

Updates a vehicle log entry.

**Path Parameters:**
- `id` (string): The vehicle log ID

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  plateNumber?: string;
  vehicleType?: VehicleType;
  cost: number;  // Required
}
```

**Example Request:**
```typescript
const response = await fetch(`/vehicle-log/${logId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    cost: 15.50
  })
});
```

**Response:**
```typescript
VehicleLog // Updated vehicle log with populated vehicleId
```

**Error Responses:**
- `404 Not Found`: If vehicle log is not found

---

## 7. Delete Vehicle Log
**DELETE** `/vehicle-log/:id`

Deletes a vehicle log by ID.

**Path Parameters:**
- `id` (string): The vehicle log ID

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch(`/vehicle-log/${logId}`, {
  method: 'DELETE',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
VehicleLog // Deleted vehicle log object
```

**Error Responses:**
- `404 Not Found`: If vehicle log is not found

---

## 8. Get Last Vehicle Log by Plate Number
**GET** `/vehicle-log/vehicle/:plateNumber/last`

Gets the last (most recent) vehicle log for a vehicle that is currently in parking.

**Path Parameters:**
- `plateNumber` (string): The license plate number (case-insensitive, converted to uppercase)

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log/vehicle/ABC123/last', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
{
  _id: string;
  vehicleId: string;
  businessId: string;
  entryTime: string;
  exitTime: null;
  duration: number;          // Calculated in minutes (updated if exitTime is null)
  cost: number;
  paymentMethod: PaymentMethod | null;
  hasMembership: boolean;
  membershipId: string | null;
  vehicleType: VehicleType;
  userName: string;
  phone: string;
  inParking: boolean;        // true
  lastLog: string;
  message: string; // "Vehicle has active membership - no charge will be applied" or "Vehicle will be charged based on parking duration"
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `404 Not Found`: If vehicle is not found or not in parking, or no log found

---

## 9. Checkout Vehicle (Exit)
**PATCH** `/vehicle-log/vehicle/:plateNumber/checkout`

Processes vehicle checkout when a vehicle exits the parking. Calculates duration and applies cost (or sets to 0 if membership is active).

**Path Parameters:**
- `plateNumber` (string): The license plate number (case-insensitive, converted to uppercase)

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Request Body:**
```typescript
{
  plateNumber?: string;
  vehicleType?: VehicleType;
  cost: number;  // Required - Cost to charge (will be set to 0 if vehicle has active membership)
}
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log/vehicle/ABC123/checkout', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'user': JSON.stringify(userHeader)
  },
  body: JSON.stringify({
    cost: 20.00
  })
});
```

**Response (with membership):**
```typescript
{
  _id: string;
  vehicleId: string;
  businessId: string;
  entryTime: string;
  exitTime: string;          // Set to current time
  duration: number;          // Calculated in minutes
  cost: number;              // 0 (membership active)
  paymentMethod: PaymentMethod | null;
  hasMembership: true;
  membershipId: string;
  vehicleType: VehicleType;
  message: "Vehicle has active membership - no charge applied";
  createdAt: string;
  updatedAt: string;
}
```

**Response (without membership):**
```typescript
{
  _id: string;
  vehicleId: string;
  businessId: string;
  entryTime: string;
  exitTime: string;
  duration: number;
  cost: number;              // Value from request body
  paymentMethod: PaymentMethod | null;
  hasMembership: false;
  membershipId: null;
  vehicleType: VehicleType;
  message: `Vehicle charged: $${cost}`;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses:**
- `404 Not Found`: If vehicle is not found or not in parking, or no active log found

---

## 10. Get Vehicle Logs by Plate Number
**GET** `/vehicle-log/vehicle/:plateNumber/logs`

Gets all vehicle logs for a specific vehicle (by plate number) within the user's business.

**Path Parameters:**
- `plateNumber` (string): The license plate number (case-insensitive, converted to uppercase)

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log/vehicle/ABC123/logs', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<VehicleLog> // Sorted by entryTime descending (newest first)
```

**Error Responses:**
- `404 Not Found`: If vehicle is not found

---

## 11. Delete All Vehicle Logs by Business
**DELETE** `/vehicle-log/all/business/:businessId`

Deletes all vehicle logs associated with a specific business.

**Path Parameters:**
- `businessId` (string): The business ID

**Example Request:**
```typescript
const response = await fetch(`/vehicle-log/all/business/${businessId}`, {
  method: 'DELETE',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
{
  acknowledged: boolean;
  deletedCount: number;
}
```

---

## 12. Get Logs by Date
**GET** `/vehicle-log/date/:date`

Gets all vehicle logs for a specific date within the user's business. The date is processed in UTC with a 5-hour offset.

**Path Parameters:**
- `date` (string): Date string (e.g., "2024-01-15" or ISO date string)

**Headers:**
```
user: <JSON stringified UserHeader object>
```

**Example Request:**
```typescript
const response = await fetch('/vehicle-log/date/2024-01-15', {
  method: 'GET',
  headers: {
    'user': JSON.stringify(userHeader)
  }
});
```

**Response:**
```typescript
Array<{
  _id: string;
  vehicleId: {
    _id: string;
    plateNumber: string;
    vehicleType: VehicleType;
  };
  businessId: string;
  entryTime: string;
  exitTime: string;          // Must have exitTime (completed logs only)
  duration: number;
  cost: number;
  paymentMethod: PaymentMethod | null;
  hasMembership: boolean;
  membershipId: string | null;
  message: string; // "Vehicle had active membership - no charge applied" or "Vehicle charged: $X.XX"
  createdAt: string;
  updatedAt: string;
}> // Sorted by entryTime descending (newest first)
```

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

// Vehicle Type Enum
enum VehicleType {
  car = 'car',
  motorcycle = 'motorcycle'
}

// Payment Method Enum
enum PaymentMethod {
  cash = 0,
  transfer = 1,
  credit = 2,
  debit = 3,
  other = 4
}

// Vehicle Entity
interface Vehicle {
  _id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  inParking: boolean;
  lastLog: string;           // ISO date string
  businessId: string;
  userName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

// Vehicle Log Entity
interface VehicleLog {
  _id: string;
  vehicleId: string | Vehicle; // Can be populated
  businessId: string;
  entryTime: string;          // ISO date string
  exitTime: string | null;     // ISO date string or null
  duration: number;            // Duration in minutes
  cost: number;
  paymentMethod: PaymentMethod | null;
  hasMembership: boolean;
  membershipId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Vehicle Log with Message (from API responses)
interface VehicleLogWithMessage extends VehicleLog {
  message?: string;
  vehicleType?: VehicleType;
  userName?: string;
  phone?: string;
  inParking?: boolean;
  lastLog?: string;
}

// Create Vehicle DTO
interface CreateVehicleDto {
  plateNumber: string;
  vehicleType: VehicleType;
}

// Update Vehicle DTO
interface UpdateVehicleDto {
  plateNumber?: string;
  vehicleType?: VehicleType;
}

// Create Vehicle Log DTO
interface CreateVehicleLogDto {
  plateNumber: string;
  vehicleType: VehicleType;
}

// Update Vehicle Log DTO
interface UpdateVehicleLogDto {
  plateNumber?: string;
  vehicleType?: VehicleType;
  cost: number;  // Required
}

// Update Business ID DTO
interface UpdateBusinessIdDto {
  from: string;  // MongoDB ObjectId
  to: string;    // MongoDB ObjectId
}
```

---

## Error Handling

All endpoints may return standard HTTP error responses:

- **400 Bad Request**: Validation errors (missing required fields, invalid data types, invalid enum values, vehicle already in parking)
- **401 Unauthorized**: Missing or invalid user header
- **404 Not Found**: Resource not found (vehicle, vehicle log, etc.)
- **500 Internal Server Error**: Server-side errors

---

## Important Notes

1. **Plate Number Handling**: All plate numbers are automatically converted to uppercase by the API.

2. **Business Scoping**: Most endpoints automatically filter by the user's business ID from the `user` header. The business ID is extracted from `user.business`.

3. **Membership Logic**: 
   - When creating a vehicle log entry, the system checks for active membership
   - If membership is active, `hasMembership` is set to `true` and `cost` is set to `0`
   - If no membership, normal charging applies

4. **Parking Status**: 
   - When a vehicle enters (creates log), `inParking` is set to `true`
   - When a vehicle exits (checkout), `inParking` is set to `false`

5. **Duration Calculation**: Duration is calculated in minutes from `entryTime` to `exitTime` (or current time if exitTime is null).

6. **Date Filtering**: The `/vehicle-log/date/:date` endpoint filters logs by exit date (only completed logs with exitTime are returned).

7. **Vehicle Auto-Creation**: If a vehicle doesn't exist when creating a log entry, it will be automatically created.

