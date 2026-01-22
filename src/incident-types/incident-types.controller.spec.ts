import { Test, TestingModule } from '@nestjs/testing';
import { IncidentTypesController } from './incident-types.controller';

describe('IncidentTypesController', () => {
  let controller: IncidentTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentTypesController],
    }).compile();

    controller = module.get<IncidentTypesController>(IncidentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
