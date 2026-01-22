# Zod Validation Best Practices

## ✅ Where to Use Zod Validation

### 1. **DTO (Data Transfer Object) Files** - ✅ RECOMMENDED

**Location:** `src/module-name/dto/*.dto.ts`

**When to use:**
- POST requests (create data)
- PATCH requests (update data)
- Query parameters validation
- Route parameters validation

**Example:**
```typescript
// src/tenants/dto/create-tenant.dto.ts
import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1),
  subscriptionPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']).optional(),
});

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
```

### 2. **Controller Layer** - ✅ RECOMMENDED

**Use ZodValidationPipe in controllers**

```typescript
import { UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createTenantSchema } from './dto';

@Controller('tenants')
export class TenantsController {
  @Post()
  @UsePipes(new ZodValidationPipe(createTenantSchema))
  async create(@Body() createTenantDto: CreateTenantDto) {
    // createTenantDto is validated and typed
  }
}
```

### 3. **Service Layer** - ❌ NOT RECOMMENDED

**Don't use Zod in service methods**
- Services should receive validated data
- Focus on business logic, not validation

### 4. **Entity/Schema Layer** - ❌ NOT RECOMMENDED

**Don't use Zod in Mongoose schemas**
- Mongoose has its own validation
- Keep database schema separate from DTO validation

---

## 🎯 Best Practices Summary

| Layer | Use Zod? | Why? |
|-------|---------|------|
| **DTO files** | ✅ Yes | Define request/response shapes |
| **Controllers** | ✅ Yes | Validate incoming requests |
| **Services** | ❌ No | Business logic only |
| **Entities/Schemas** | ❌ No | Use Mongoose built-in validation |

---

## 📋 Common Zod Validations

### String Validation
```typescript
z.string()
z.string().min(3, 'Too short')
z.string().max(50, 'Too long')
z.string().email('Invalid email')
z.string().url('Invalid URL')
z.string().uuid('Invalid UUID')
```

### Number Validation
```typescript
z.number()
z.number().positive()
z.number().int()
z.number().min(0)
z.number().max(100)
```

### Enum Validation
```typescript
z.enum(['BASIC', 'STANDARD', 'PREMIUM'])
z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
```

### Optional Fields
```typescript
z.string().optional()
z.number().optional()
z.boolean().optional()
```

### Object Validation
```typescript
z.object({
  name: z.string(),
  age: z.number(),
})
z.record(z.string(), z.any()) // Key-value pairs
```

### Array Validation
```typescript
z.array(z.string())
z.array(z.number()).min(1).max(10)
```

### Date Validation
```typescript
z.string().datetime()
z.date()
z.coerce.date() // Convert string to Date
```

---

## 🔥 Advanced Zod Patterns

### Nested Object Validation
```typescript
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
  }),
});
```

### Array of Objects
```typescript
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })),
});
```

### Conditional Validation
```typescript
export const createProfileSchema = z.object({
  isPremium: z.boolean(),
  // Required only if isPremium is true
  subscriptionId: z.string().optional(),
}).refine((data) => {
  if (data.isPremium && !data.subscriptionId) {
    return false;
  }
  return true;
}, {
  message: 'Subscription ID required for premium users',
  path: ['subscriptionId'],
});
```

---

## ✨ Why This Approach?

### ✅ Pros
1. **Separation of Concerns**: Validation logic separate from business logic
2. **Type Safety**: Auto-generate TypeScript types from Zod schemas
3. **Better Error Messages**: Custom error messages for each field
4. **Consistent**: All requests validated the same way
5. **Testable**: Easy to test validation schemas independently

### ❌ Why Not Everywhere?
1. **Overhead**: Don't need validation in services (already validated)
2. **Performance**: Validate once at controller layer
3. **Clarity**: Services focus on business logic, not validation

---

## 📝 Example Complete Flow

```typescript
// 1. DTO Definition (dto/create-tenant.dto.ts)
import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
});

export type CreateTenantDto = z.infer<typeof createTenantSchema>;

// 2. Controller Usage (tenants.controller.ts)
import { UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createTenantSchema } from './dto';

@Post()
@UsePipes(new ZodValidationPipe(createTenantSchema))
async create(@Body() dto: CreateTenantDto) {
  // ✅ dto is validated and type-safe
  return this.tenantsService.create(dto);
}

// 3. Service (tenants.service.ts)
async create(dto: CreateTenantDto) {
  // ✅ No validation needed, already validated
  const tenant = new this.tenantModel(dto);
  return tenant.save();
}
```

---

## 🚀 Quick Reference

**Status Codes:**
- `200 OK` - GET, PATCH success
- `201 CREATED` - POST success (new resource created)
- `204 NO CONTENT` - DELETE success (no response body)
- `400 BAD REQUEST` - Validation failed (Zod error)
- `404 NOT FOUND` - Resource not found

**Response Format:**
```typescript
// Success
{
  success: true,
  statusCode: 200,
  data: { ... }
}

// Error (from exception filter)
{
  success: false,
  statusCode: 400,
  message: 'Validation failed',
  errors: [...]
}
```
