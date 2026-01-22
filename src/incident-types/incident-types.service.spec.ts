import { Test, TestingModule } from '@nestjs/testing';
import { IncidentTypesService } from './incident-types.service';

describe('IncidentTypesService', () => {
  let service: IncidentTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentTypesService],
    }).compile();

    service = module.get<IncidentTypesService>(IncidentTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
