# Clients API - Sample Data

## Create Client - Sample Data

Copy any of these examples and paste into Postman **Body** > **raw** (JSON)

### Example 1: Corporate Client
```json
{
  "tenantId": "<TENANT_ID>",
  "name": "ABC Corporation Pte Ltd",
  "contactPerson": "John Doe",
  "email": "contact@abc-corp.com",
  "phone": "+65-6234-5678",
  "address": "123 Business Park, #10-01, Singapore 123456",
  "clientStatus": "ACTIVE"
}
```

### Example 2: Retail Client
```json
{
  "tenantId": "<TENANT_ID>",
  "name": "Prime Retail Mall",
  "contactPerson": "Sarah Lee",
  "email": "admin@primeretail.com.sg",
  "phone": "+65-6456-7890",
  "address": "456 Orchard Road, Singapore 238873",
  "clientStatus": "ACTIVE"
}
```

### Example 3: Industrial Client
```json
{
  "tenantId": "<TENANT_ID>",
  "name": "Jurong Industrial Park",
  "contactPerson": "Ahmad Hassan",
  "email": "operations@jip.com.sg",
  "phone": "+65-6677-8899",
  "address": "789 Jurong West Street, Singapore 648901",
  "clientStatus": "ACTIVE"
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/clients` | Create new client |
| GET | `/api/v1/clients` | Get all clients |
| GET | `/api/v1/clients/:id` | Get client by ID |
| PATCH | `/api/v1/clients/:id` | Update client |
| DELETE | `/api/v1/clients/:id` | Delete client |

## Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tenantId | string | ✅ | Reference to Tenant |
| name | string | ✅ | Client company name |
| contactPerson | string | ❌ | Primary contact person |
| email | string | ✅ | Client email (unique) |
| phone | string | ✅ | Contact phone number |
| address | string | ❌ | Business address |
| clientStatus | enum | ✅ | ACTIVE/INACTIVE (default: ACTIVE) |

## Error Examples

### Duplicate Email (409 Conflict)
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already exists",
  "errors": []
}
```

### Missing Required Field (400 Bad Request)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "tenantId",
      "message": "Required"
    }
  ]
}
```
