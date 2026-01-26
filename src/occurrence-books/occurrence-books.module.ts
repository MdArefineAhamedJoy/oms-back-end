import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OccurrenceBooksService } from './occurrence-books.service';
import { OccurrenceBooksController } from './occurrence-books.controller';
import { OccurrenceBook, OccurrenceBookSchema } from './schemas/occurrence-book.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: OccurrenceBook.name, schema: OccurrenceBookSchema }])],
  controllers: [OccurrenceBooksController],
  providers: [OccurrenceBooksService],
  exports: [OccurrenceBooksService],
})
export class OccurrenceBooksModule {}
