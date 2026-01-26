import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentTablesService } from './document-tables.service';
import { DocumentTablesController } from './document-tables.controller';
import { DocumentTable, DocumentTableSchema } from './schemas/document-table.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DocumentTable.name, schema: DocumentTableSchema }])],
  providers: [DocumentTablesService],
  controllers: [DocumentTablesController],
})
export class DocumentTablesModule {}
