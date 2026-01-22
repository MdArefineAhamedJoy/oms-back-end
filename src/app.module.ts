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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
