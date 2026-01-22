import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatrolRoutesService } from './patrol-routes.service';
import { PatrolRoutesController } from './patrol-routes.controller';
import { PatrolRoute, PatrolRouteSchema } from './schemas/patrol-route.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatrolRoute.name, schema: PatrolRouteSchema },
    ]),
  ],
  providers: [PatrolRoutesService],
  controllers: [PatrolRoutesController],
})
export class PatrolRoutesModule {}
