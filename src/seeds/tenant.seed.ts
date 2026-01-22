import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../tenants/schemas/tenant.schema';

@Injectable()
export class TenantSeed {
  constructor(
    @InjectModel(Tenant.name)
    private tenantModel: Model<TenantDocument>,
  ) {}

  async seed() {
    const count = await this.tenantModel.countDocuments();
    if (count > 0) {
      console.log('Tenants already exist, skipping seed...');
      return;
    }

    const tenants = [
      {
        name: 'SecureGuard Solutions',
        tenantCode: 'SECURE001',
        email: 'admin@secureguard.com',
        phone: '+65-6123-4567',
        licenseNumber: 'LG-2024-001',
        subscriptionPlan: 'PREMIUM',
        maxSites: 50,
        maxUsers: 500,
        tenantStatus: 'ACTIVE',
        settings: {
          timezone: 'Asia/Singapore',
          currency: 'SGD',
        },
      },
      {
        name: 'Metro Security Services',
        tenantCode: 'METRO002',
        email: 'contact@metrosecurity.sg',
        phone: '+65-6234-5678',
        licenseNumber: 'LG-2024-002',
        subscriptionPlan: 'STANDARD',
        maxSites: 20,
        maxUsers: 200,
        tenantStatus: 'ACTIVE',
        settings: {
          timezone: 'Asia/Singapore',
          currency: 'SGD',
        },
      },
      {
        name: 'CityWatch Protection',
        tenantCode: 'CITY003',
        email: 'info@citywatch.com.sg',
        phone: '+65-6345-6789',
        licenseNumber: 'LG-2024-003',
        subscriptionPlan: 'BASIC',
        maxSites: 10,
        maxUsers: 100,
        tenantStatus: 'ACTIVE',
        settings: {
          timezone: 'Asia/Singapore',
          currency: 'SGD',
        },
      },
      {
        name: 'Island Guard Force',
        tenantCode: 'ISL004',
        email: 'ops@islandguard.com',
        phone: '+65-6456-7890',
        licenseNumber: 'LG-2024-004',
        subscriptionPlan: 'STANDARD',
        maxSites: 25,
        maxUsers: 250,
        tenantStatus: 'ACTIVE',
        settings: {
          timezone: 'Asia/Singapore',
          currency: 'SGD',
        },
      },
      {
        name: 'Fortress Security Pte Ltd',
        tenantCode: 'FORT005',
        email: 'admin@fortresssec.sg',
        phone: '+65-6567-8901',
        licenseNumber: 'LG-2024-005',
        subscriptionPlan: 'PREMIUM',
        maxSites: 100,
        maxUsers: 1000,
        tenantStatus: 'ACTIVE',
        settings: {
          timezone: 'Asia/Singapore',
          currency: 'SGD',
        },
      },
    ];

    await this.tenantModel.insertMany(tenants);
    console.log(`${tenants.length} tenants seeded successfully!`);
  }
}
