import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { mongooseConfig } from './config/mongoose.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { ClientsModule } from './clients/clients.module';
import { SitesModule } from './sites/sites.module';
import { UserProfilesModule } from './user-profiles/user-profiles.module';
import { ShiftTypesModule } from './shift-types/shift-types.module';
import { LeavePoliciesModule } from './leave-policies/leave-policies.module';
import { SettingsModule } from './settings/settings.module';
import { IncidentTypesModule } from './incident-types/incident-types.module';
import { IncidentSubtypesModule } from './incident-subtypes/incident-subtypes.module';
import { PatrolRoutesModule } from './patrol-routes/patrol-routes.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { ShiftsModule } from './shifts/shifts.module';
import { PatrolsModule } from './patrols/patrols.module';
import { PatrolScansModule } from './patrol-scans/patrol-scans.module';
import { IncidentsModule } from './incidents/incidents.module';
import { VisitorsModule } from './visitors/visitors.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, mongooseConfig],
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const { uri } = mongooseConfig();
        return { uri };
      },
    }),
    AuthModule,
    UsersModule,
    TenantsModule,
    ClientsModule,
    SitesModule,
    UserProfilesModule,
    ShiftTypesModule,
    LeavePoliciesModule,
    SettingsModule,
    IncidentTypesModule,
    IncidentSubtypesModule,
    PatrolRoutesModule,
    CheckpointsModule,
    ShiftsModule,
    PatrolsModule,
    PatrolScansModule,
    IncidentsModule,
    VisitorsModule,
    VehiclesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
