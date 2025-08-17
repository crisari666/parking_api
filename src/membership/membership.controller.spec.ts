import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';

describe('MembershipController', () => {
  let controller: MembershipController;
  let service: MembershipService;

  const mockMembershipService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByVehicleAndBusiness: jest.fn(),
    toggleEnable: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockMembership = {
    _id: 'test-id',
    dateStart: new Date('2024-01-01'),
    dateEnd: new Date('2024-12-31'),
    value: 100,
    businessId: 'business-id',
    enable: true,
    vehicleId: 'vehicle-id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [
        {
          provide: MembershipService,
          useValue: mockMembershipService,
        },
      ],
    }).compile();

    controller = module.get<MembershipController>(MembershipController);
    service = module.get<MembershipService>(MembershipService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new membership', async () => {
      const inputCreateMembershipDto: CreateMembershipDto = {
        dateStart: new Date('2024-01-01'),
        dateEnd: new Date('2024-12-31'),
        value: 100,
        businessId: 'business-id',
        enable: true,
        vehicleId: 'vehicle-id',
      };

      const expectedMembership = { ...mockMembership };
      mockMembershipService.create.mockResolvedValue(expectedMembership);

      const actualMembership = await controller.create(inputCreateMembershipDto);

      expect(mockMembershipService.create).toHaveBeenCalledWith(inputCreateMembershipDto);
      expect(actualMembership).toEqual(expectedMembership);
    });
  });

  describe('findAll', () => {
    it('should return all memberships', async () => {
      const expectedMemberships = [mockMembership];
      mockMembershipService.findAll.mockResolvedValue(expectedMemberships);

      const actualMemberships = await controller.findAll();

      expect(mockMembershipService.findAll).toHaveBeenCalled();
      expect(actualMemberships).toEqual(expectedMemberships);
    });
  });

  describe('findByVehicleAndBusiness', () => {
    it('should return memberships by vehicle and business', async () => {
      const inputVehicleId = 'vehicle-id';
      const inputBusinessId = 'business-id';
      const expectedMemberships = [mockMembership];

      mockMembershipService.findByVehicleAndBusiness.mockResolvedValue(expectedMemberships);

      const actualMemberships = await controller.findByVehicleAndBusiness(inputVehicleId, inputBusinessId);

      expect(mockMembershipService.findByVehicleAndBusiness).toHaveBeenCalledWith(inputVehicleId, inputBusinessId);
      expect(actualMemberships).toEqual(expectedMemberships);
    });
  });

  describe('findOne', () => {
    it('should return a membership by id', async () => {
      const inputId = 'test-id';
      const expectedMembership = { ...mockMembership };

      mockMembershipService.findOne.mockResolvedValue(expectedMembership);

      const actualMembership = await controller.findOne(inputId);

      expect(mockMembershipService.findOne).toHaveBeenCalledWith(inputId);
      expect(actualMembership).toEqual(expectedMembership);
    });
  });

  describe('toggleEnable', () => {
    it('should toggle membership enable status', async () => {
      const inputId = 'test-id';
      const inputToggleDto: ToggleMembershipDto = { enable: false };
      const expectedMembership = { ...mockMembership, enable: false };

      mockMembershipService.toggleEnable.mockResolvedValue(expectedMembership);

      const actualMembership = await controller.toggleEnable(inputId, inputToggleDto);

      expect(mockMembershipService.toggleEnable).toHaveBeenCalledWith(inputId, inputToggleDto);
      expect(actualMembership).toEqual(expectedMembership);
    });
  });

  describe('update', () => {
    it('should update a membership', async () => {
      const inputId = 'test-id';
      const inputUpdateDto: UpdateMembershipDto = { value: 200 };
      const expectedMembership = { ...mockMembership, value: 200 };

      mockMembershipService.update.mockResolvedValue(expectedMembership);

      const actualMembership = await controller.update(inputId, inputUpdateDto);

      expect(mockMembershipService.update).toHaveBeenCalledWith(inputId, inputUpdateDto);
      expect(actualMembership).toEqual(expectedMembership);
    });
  });

  describe('remove', () => {
    it('should remove a membership', async () => {
      const inputId = 'test-id';
      mockMembershipService.remove.mockResolvedValue(undefined);

      await controller.remove(inputId);

      expect(mockMembershipService.remove).toHaveBeenCalledWith(inputId);
    });
  });
});
