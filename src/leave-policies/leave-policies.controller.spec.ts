import { Test, TestingModule } from '@nestjs/testing';
import { LeavePoliciesController } from './leave-policies.controller';

describe('LeavePoliciesController', () => {
  let controller: LeavePoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeavePoliciesController],
    }).compile();

    controller = module.get<LeavePoliciesController>(LeavePoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
