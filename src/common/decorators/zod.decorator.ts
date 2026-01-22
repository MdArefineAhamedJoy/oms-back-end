import { ZodSchema } from 'zod';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export const ZodBody = (schema: ZodSchema) =>
  new ZodValidationPipe(schema);
