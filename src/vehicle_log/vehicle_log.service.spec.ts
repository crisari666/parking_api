import { Test, TestingModule } from '@nestjs/testing';
import { VehicleLogService } from './vehicle_log.service';

describe('VehicleLogService', () => {
  let service: VehicleLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleLogService],
    }).compile();

    service = module.get<VehicleLogService>(VehicleLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
