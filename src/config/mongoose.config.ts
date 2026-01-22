import { registerAs } from '@nestjs/config';

export const mongooseConfig = registerAs('mongoose', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/oms-db',
}));
