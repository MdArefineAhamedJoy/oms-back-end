import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppVersionsService } from './app-versions.service';
import { AppVersionsController } from './app-versions.controller';
import { AppVersion, AppVersionSchema } from './schemas/app-version.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AppVersion.name, schema: AppVersionSchema }])],
  providers: [AppVersionsService],
  controllers: [AppVersionsController],
})
export class AppVersionsModule {}
