import { Test, TestingModule } from '@nestjs/testing';
import { LeavePoliciesService } from './leave-policies.service';

describe('LeavePoliciesService', () => {
  let service: LeavePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeavePoliciesService],
    }).compile();

    service = module.get<LeavePoliciesService>(LeavePoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
