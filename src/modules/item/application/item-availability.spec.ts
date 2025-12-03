import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingRepository } from '../../booking/domain/booking.repository';
import { ItemRepository } from '../domain/item.repository';
import { ItemService } from './item.service';

const mockItem = {
  id: 'item-1',
  ownerId: 'owner-1',
  isAvailable: true,
};

describe('ItemService', () => {
  let itemService: ItemService;
  let itemRepo: any;
  let bookingRepo: any;

  beforeEach(async () => {
    itemRepo = {
      findItemById: jest.fn(),
      updateItem: jest.fn(),
    };
    bookingRepo = {
      findBookingsByItem: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: ItemRepository, useValue: itemRepo },
        { provide: BookingRepository, useValue: bookingRepo },
      ],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
  });

  describe('toggleAvailability', () => {
    it('should toggle availability from false to true', async () => {
      itemRepo.findItemById.mockResolvedValue({ ...mockItem, isAvailable: false });
      itemRepo.updateItem.mockResolvedValue({ ...mockItem, isAvailable: true });

      await itemService.toggleAvailability('item-1', 'owner-1');

      expect(bookingRepo.findBookingsByItem).not.toHaveBeenCalled();
      expect(itemRepo.updateItem).toHaveBeenCalledWith('item-1', { isAvailable: true });
    });

    it('should toggle availability from true to false if no active bookings', async () => {
      itemRepo.findItemById.mockResolvedValue({ ...mockItem, isAvailable: true });
      bookingRepo.findBookingsByItem.mockResolvedValue([]); // No active bookings
      itemRepo.updateItem.mockResolvedValue({ ...mockItem, isAvailable: false });

      await itemService.toggleAvailability('item-1', 'owner-1');

      expect(bookingRepo.findBookingsByItem).toHaveBeenCalledTimes(2); // accepted and picked_up
      expect(itemRepo.updateItem).toHaveBeenCalledWith('item-1', { isAvailable: false });
    });

    it('should throw if trying to turn off availability with accepted bookings', async () => {
      itemRepo.findItemById.mockResolvedValue({ ...mockItem, isAvailable: true });
      bookingRepo.findBookingsByItem.mockImplementation((id, status) => {
        if (status === 'accepted') return ['booking-1'];
        return [];
      });

      await expect(
        itemService.toggleAvailability('item-1', 'owner-1'),
      ).rejects.toThrow(BadRequestException);

      expect(itemRepo.updateItem).not.toHaveBeenCalled();
    });

    it('should throw if trying to turn off availability with picked_up bookings', async () => {
      itemRepo.findItemById.mockResolvedValue({ ...mockItem, isAvailable: true });
      bookingRepo.findBookingsByItem.mockImplementation((id, status) => {
        if (status === 'picked_up') return ['booking-1'];
        return [];
      });

      await expect(
        itemService.toggleAvailability('item-1', 'owner-1'),
      ).rejects.toThrow(BadRequestException);

      expect(itemRepo.updateItem).not.toHaveBeenCalled();
    });

    it('should throw if user is not owner', async () => {
      itemRepo.findItemById.mockResolvedValue(mockItem);

      await expect(
        itemService.toggleAvailability('item-1', 'other-user'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
