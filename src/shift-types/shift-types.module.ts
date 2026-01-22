import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShiftTypesService } from './shift-types.service';
import { ShiftTypesController } from './shift-types.controller';
import { ShiftType, ShiftTypeSchema } from './schemas/shift-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShiftType.name, schema: ShiftTypeSchema },
    ]),
  ],
  providers: [ShiftTypesService],
  controllers: [ShiftTypesController],
})
export class ShiftTypesModule {}
