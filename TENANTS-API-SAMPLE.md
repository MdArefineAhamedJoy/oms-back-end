# Tenants API - Sample Data

## Create Tenant - Sample Data

Copy any of these examples and paste into Postman **Body** > **raw** (JSON)

### Example 1: Premium Security Company
```json
{
  "name": "SecureGuard Solutions Pte Ltd",
  "tenantCode": "SECURE001",
  "email": "admin@secureguard.com",
  "phone": "+65-6123-4567",
  "licenseNumber": "LG-2024-001",
  "subscriptionPlan": "PREMIUM",
  "maxSites": 50,
  "maxUsers": 500,
  "tenantStatus": "ACTIVE",
  "settings": {
    "timezone": "Asia/Singapore",
    "currency": "SGD"
  }
}
```

### Example 2: Standard Security Company
```json
{
  "name": "Metro Security Services",
  "tenantCode": "METRO002",
  "email": "contact@metrosecurity.sg",
  "phone": "+65-6234-5678",
  "licenseNumber": "LG-2024-002",
  "subscriptionPlan": "STANDARD",
  "maxSites": 20,
  "maxUsers": 200,
  "tenantStatus": "ACTIVE",
  "settings": {
    "timezone": "Asia/Singapore",
    "currency": "SGD"
  }
}
```

### Example 3: Basic Security Company
```json
{
  "name": "CityWatch Protection",
  "tenantCode": "CITY003",
  "email": "info@citywatch.com.sg",
  "phone": "+65-6345-6789",
  "licenseNumber": "LG-2024-003",
  "subscriptionPlan": "BASIC",
  "maxSites": 10,
  "maxUsers": 100,
  "tenantStatus": "ACTIVE",
  "settings": {
    "timezone": "Asia/Singapore",
    "currency": "SGD"
  }
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tenants` | Create new tenant |
| GET | `/api/v1/tenants` | Get all tenants |
| GET | `/api/v1/tenants/:id` | Get tenant by ID |
| PATCH | `/api/v1/tenants/:id` | Update tenant |
| DELETE | `/api/v1/tenants/:id` | Delete tenant |
| POST | `/api/v1/seeds/tenants` | Seed 5 fake tenants |

## Fields Description

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| name | string | ✅ | ✅ | Tenant company name |
| tenantCode | string | ✅ | ✅ | Unique tenant code |
| email | string | ✅ | ✅ | Admin email |
| phone | string | ✅ | ❌ | Contact phone |
| licenseNumber | string | ✅ | ✅ | Business license number |
| subscriptionPlan | enum | ❌ | ❌ | BASIC/STANDARD/PREMIUM (default: BASIC) |
| maxSites | number | ❌ | ❌ | Maximum sites allowed (default: 10) |
| maxUsers | number | ❌ | ❌ | Maximum users allowed (default: 100) |
| tenantStatus | enum | ✅ | ❌ | ACTIVE/INACTIVE/SUSPENDED (default: ACTIVE) |
| settings | object | ❌ | ❌ | Additional settings (timezone, currency, etc) |

## Subscription Plans

- **BASIC**: 10 sites, 100 users
- **STANDARD**: 20 sites, 200 users
- **PREMIUM**: Unlimited sites and users

## Validation Rules

- **name**: Required, unique
- **tenantCode**: Required, unique
- **email**: Required, unique, valid email format
- **phone**: Required
- **licenseNumber**: Required, unique
- **tenantStatus**: Required (ACTIVE/INACTIVE/SUSPENDED)

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
      "field": "tenantStatus",
      "message": "Required"
    }
  ]
}
```

### Invalid Email Format (400 Bad Request)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```
