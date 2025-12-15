# Vehicle Log Delete Endpoint Documentation

## Endpoint Information

**Endpoint:** `DELETE /vehicle-log/admin/:id`

**Description:** Mark a vehicle log as deleted (soft delete) by its ID. The record is not physically removed from the database but is marked with `deleted: true` and `deletedAt` timestamp. Only accessible by users with `admin` or `user` roles. Deleted logs are automatically excluded from all query results to maintain data integrity and avoid issues with customers.

## Authentication & Authorization

- **Authentication Required:** Yes (via `user` header)
- **Allowed Roles:** `admin`, `user`
- **Forbidden Roles:** `worker`

## Request Details

### Headers
```typescript
{
  'user': string,  // JSON stringified UserHeader object
  'authorization': string  // Bearer token
}
```

### URL Parameters
- `id` (string, required): The vehicle log ID to delete

### User Header Structure
```typescript
{
  uuid: string;      // User ID
  role: string;      // Must be 'admin' or 'user'
  iat: number;       // Token issued at timestamp
  exp: number;       // Token expiration timestamp
  business: string;  // Associated business ID
}
```

## Example Request

```typescript
// TypeScript/JavaScript example
const response = await fetch(`/vehicle-log/admin/${vehicleLogId}`, {
  method: 'DELETE',
  headers: {
    'authorization': `Bearer ${token}`,
    'user': JSON.stringify({
      uuid: userUuid,
      role: userRole,  // Must be 'admin' or 'user'
      iat: iat,
      exp: exp,
      business: businessId
    })
  }
});
```

## Response

### Success Response (200 OK)
Returns the vehicle log object with `deleted: true` and `deletedAt` timestamp:
```typescript
{
  _id: string;
  vehicleId: string | ObjectId;
  entryTime: Date;
  exitTime?: Date;
  duration?: number;
  cost?: number;
  hasMembership?: boolean;
  membershipId?: string;
  businessId: string;
  deleted: true;              // Marked as deleted
  deletedAt: Date;            // Timestamp when deleted
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Error Responses

#### 403 Forbidden
```typescript
{
  statusCode: 403,
  message: "Only admin or user roles can delete vehicle logs",
  error: "Forbidden"
}
```
**Cause:** User role is not `admin` or `user` (e.g., user is `worker`)

#### 404 Not Found
```typescript
{
  statusCode: 404,
  message: "Vehicle log not found",
  error: "Not Found"
}
```
**Cause:** Vehicle log with the provided ID does not exist

#### 401 Unauthorized
```typescript
{
  error: "Not authorized"
}
```
**Cause:** Missing or invalid authentication token

## Role Validation Logic

```typescript
if (!user || (user.role !== UserRole.admin && user.role !== UserRole.user)) {
  throw new ForbiddenException('Only admin or user roles can delete vehicle logs');
}
```

## Implementation Notes

1. **Soft Delete:** The endpoint performs a soft delete by marking the record with `deleted: true` and setting `deletedAt` timestamp. The record remains in the database for audit and customer service purposes.

2. **Automatic Exclusion:** All query endpoints automatically exclude deleted records using `deleted: { $ne: true }` filter. This ensures deleted logs never appear in:
   - `GET /vehicle-log` (findAll)
   - `GET /vehicle-log/:id` (findOne)
   - `GET /vehicle-log/active` (getActiveVehicles)
   - `GET /vehicle-log/vehicle/:plateNumber/logs` (getVehicleLogs)
   - `GET /vehicle-log/vehicle-id/:vehicleId/logs` (getVehicleLogsById)
   - `GET /vehicle-log/date/:date` (getLogsByDate)
   - `POST /vehicle-log/filter` (filterLogsByDateRange)
   - `GET /vehicle-log/vehicle/:plateNumber/last` (getLastVehicleLog)
   - `PATCH /vehicle-log/vehicle/:plateNumber/checkout` (checkout)

3. **Role Check:** The endpoint validates that the user's role is either `admin` or `user` before allowing deletion.

4. **No Business Filter:** Unlike the standard delete endpoint (`DELETE /vehicle-log/:id`), this endpoint does not filter by business ID, allowing admin/user roles to mark any vehicle log as deleted.

5. **Data Preservation:** Records are preserved in the database to maintain historical data integrity and avoid issues with customer disputes or accounting requirements.

6. **User Header:** Must be JSON stringified when sending in the request header.

## Frontend Integration Example

```typescript
async function deleteVehicleLog(vehicleLogId: string, userHeader: UserHeader): Promise<VehicleLog> {
  // Validate user role before making request
  if (userHeader.role !== 'admin' && userHeader.role !== 'user') {
    throw new Error('Insufficient permissions to delete vehicle log');
  }

  const response = await fetch(`/vehicle-log/admin/${vehicleLogId}`, {
    method: 'DELETE',
    headers: {
      'authorization': `Bearer ${getToken()}`,
      'user': JSON.stringify(userHeader)
    }
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to delete vehicle logs');
    }
    if (response.status === 404) {
      throw new Error('Vehicle log not found');
    }
    throw new Error('Failed to delete vehicle log');
  }

  const deletedLog = await response.json();
  // Note: The log is marked as deleted but remains in database
  // It will automatically be excluded from all future queries
  return deletedLog;
}
```

## Important Notes for Frontend

1. **Soft Delete Behavior:** After calling this endpoint, the vehicle log will be marked as deleted but will not appear in any list or detail queries. The data is preserved in the database.

2. **No Undo Endpoint:** Currently, there is no endpoint to restore deleted logs. If you need this functionality, it would require a separate restore endpoint.

3. **UI Considerations:** 
   - Deleted logs will automatically disappear from all lists and searches
   - Consider showing a confirmation dialog before deletion
   - You may want to show a success message indicating the log has been deleted

4. **Data Integrity:** This soft delete approach ensures:
   - Historical data is preserved for accounting and audit purposes
   - Customer disputes can be resolved with complete historical records
   - No data loss that could cause issues with customers or financial records
