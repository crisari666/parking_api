import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { MembershipModel } from '../app/schemas/membership.schema';

describe('MembershipService', () => {
  let service: MembershipService;
  let model: Model<MembershipModel>;

  const mockMembershipModel = {
    new: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
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
      providers: [
        MembershipService,
        {
          provide: getModelToken(MembershipModel.name),
          useValue: mockMembershipModel,
        },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    model = module.get<Model<MembershipModel>>(getModelToken(MembershipModel.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockMembershipModel.new.mockReturnValue(expectedMembership);
      mockMembershipModel.save.mockResolvedValue(expectedMembership);

      const actualMembership = await service.create(inputCreateMembershipDto);

      expect(mockMembershipModel.new).toHaveBeenCalledWith(inputCreateMembershipDto);
      expect(mockMembershipModel.save).toHaveBeenCalled();
      expect(actualMembership).toEqual(expectedMembership);
    });
  });

  describe('findAll', () => {
    it('should return all memberships', async () => {
      const expectedMemberships = [mockMembership];
      mockMembershipModel.find.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(expectedMemberships);

      const actualMemberships = await service.findAll();

      expect(mockMembershipModel.find).toHaveBeenCalled();
      expect(mockMembershipModel.exec).toHaveBeenCalled();
      expect(actualMemberships).toEqual(expectedMemberships);
    });
  });

  describe('findOne', () => {
    it('should return a membership by id', async () => {
      const inputId = 'test-id';
      mockMembershipModel.findById.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(mockMembership);

      const actualMembership = await service.findOne(inputId);

      expect(mockMembershipModel.findById).toHaveBeenCalledWith(inputId);
      expect(mockMembershipModel.exec).toHaveBeenCalled();
      expect(actualMembership).toEqual(mockMembership);
    });

    it('should throw NotFoundException when membership not found', async () => {
      const inputId = 'non-existent-id';
      mockMembershipModel.findById.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(null);

      await expect(service.findOne(inputId)).rejects.toThrow(NotFoundException);
      expect(mockMembershipModel.findById).toHaveBeenCalledWith(inputId);
    });
  });

  describe('findByVehicleAndBusiness', () => {
    it('should return memberships by vehicle and business', async () => {
      const inputVehicleId = 'vehicle-id';
      const inputBusinessId = 'business-id';
      const expectedMemberships = [mockMembership];

      mockMembershipModel.find.mockReturnValue(mockMembershipModel);
      mockMembershipModel.sort.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(expectedMemberships);

      const actualMemberships = await service.findByVehicleAndBusiness(inputVehicleId, inputBusinessId);

      expect(mockMembershipModel.find).toHaveBeenCalledWith({ vehicleId: inputVehicleId, businessId: inputBusinessId });
      expect(mockMembershipModel.sort).toHaveBeenCalledWith({ dateStart: -1 });
      expect(mockMembershipModel.exec).toHaveBeenCalled();
      expect(actualMemberships).toEqual(expectedMemberships);
    });
  });

  describe('toggleEnable', () => {
    it('should toggle membership enable status', async () => {
      const inputId = 'test-id';
      const inputToggleDto: ToggleMembershipDto = { enable: false };
      const expectedMembership = { ...mockMembership, enable: false };

      mockMembershipModel.findByIdAndUpdate.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(expectedMembership);

      const actualMembership = await service.toggleEnable(inputId, inputToggleDto);

      expect(mockMembershipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        inputId,
        { enable: inputToggleDto.enable },
        { new: true }
      );
      expect(mockMembershipModel.exec).toHaveBeenCalled();
      expect(actualMembership).toEqual(expectedMembership);
    });

    it('should throw NotFoundException when membership not found', async () => {
      const inputId = 'non-existent-id';
      const inputToggleDto: ToggleMembershipDto = { enable: false };

      mockMembershipModel.findByIdAndUpdate.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(null);

      await expect(service.toggleEnable(inputId, inputToggleDto)).rejects.toThrow(NotFoundException);
      expect(mockMembershipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        inputId,
        { enable: inputToggleDto.enable },
        { new: true }
      );
    });
  });

  describe('update', () => {
    it('should update a membership', async () => {
      const inputId = 'test-id';
      const inputUpdateDto: UpdateMembershipDto = { value: 200 };
      const expectedMembership = { ...mockMembership, value: 200 };

      mockMembershipModel.findByIdAndUpdate.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(expectedMembership);

      const actualMembership = await service.update(inputId, inputUpdateDto);

      expect(mockMembershipModel.findByIdAndUpdate).toHaveBeenCalledWith(inputId, inputUpdateDto, { new: true });
      expect(mockMembershipModel.exec).toHaveBeenCalled();
      expect(actualMembership).toEqual(expectedMembership);
    });

    it('should throw NotFoundException when membership not found', async () => {
      const inputId = 'non-existent-id';
      const inputUpdateDto: UpdateMembershipDto = { value: 200 };

      mockMembershipModel.findByIdAndUpdate.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(null);

      await expect(service.update(inputId, inputUpdateDto)).rejects.toThrow(NotFoundException);
      expect(mockMembershipModel.findByIdAndUpdate).toHaveBeenCalledWith(inputId, inputUpdateDto, { new: true });
    });
  });

  describe('remove', () => {
    it('should remove a membership', async () => {
      const inputId = 'test-id';
      mockMembershipModel.findByIdAndDelete.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(mockMembership);

      await service.remove(inputId);

      expect(mockMembershipModel.findByIdAndDelete).toHaveBeenCalledWith(inputId);
      expect(mockMembershipModel.exec).toHaveBeenCalled();
    });

    it('should throw NotFoundException when membership not found', async () => {
      const inputId = 'non-existent-id';
      mockMembershipModel.findByIdAndDelete.mockReturnValue(mockMembershipModel);
      mockMembershipModel.exec.mockResolvedValue(null);

      await expect(service.remove(inputId)).rejects.toThrow(NotFoundException);
      expect(mockMembershipModel.findByIdAndDelete).toHaveBeenCalledWith(inputId);
    });
  });
});
