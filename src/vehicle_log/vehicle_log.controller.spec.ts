import { Test, TestingModule } from '@nestjs/testing';
import { VehicleLogController } from './vehicle_log.controller';
import { VehicleLogService } from './vehicle_log.service';

describe('VehicleLogController', () => {
  let controller: VehicleLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleLogController],
      providers: [VehicleLogService],
    }).compile();

    controller = module.get<VehicleLogController>(VehicleLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
