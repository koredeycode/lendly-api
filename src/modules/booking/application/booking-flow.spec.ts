import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DRIZZLE } from '../../database/database.constants';
import { ItemRepository } from '../../item/domain/item.repository';
import { EmailJobService } from '../../jobs/application/email-job.service';
import { UserRepository } from '../../user/domain/user.repository';
import { WalletService } from '../../wallet/application/wallet.service';
import { BookingRepository } from '../domain/booking.repository';
import { AcceptBookingUseCase } from './accept-booking.usecase';
import { PickupBookingUseCase } from './pickup-booking.usecase';

const mockBooking = {
  id: 'booking-1',
  itemId: 'item-1',
  borrowerId: 'borrower-1',
  status: 'pending',
  requestedFrom: new Date('2023-01-01'),
  requestedTo: new Date('2023-01-05'),
  totalChargedCents: 1000,
  thankYouTipCents: 100,
  item: {
    id: 'item-1',
    ownerId: 'owner-1',
    title: 'Test Item',
    owner: {
      id: 'owner-1',
      email: 'owner@test.com',
      name: 'Owner',
    },
  },
  borrower: {
    id: 'borrower-1',
    email: 'borrower@test.com',
    name: 'Borrower',
  },
};

describe('Booking Flow', () => {
  let acceptBookingUseCase: AcceptBookingUseCase;
  let pickupBookingUseCase: PickupBookingUseCase;
  let bookingRepo: any;
  let walletService: any;
  let emailJobService: any;

  beforeEach(async () => {
    bookingRepo = {
      findBookingById: jest.fn(),
      checkAvailability: jest.fn(),
      acceptBooking: jest.fn(),
      updateBookingStatus: jest.fn(),
    };
    walletService = {
      transferFunds: jest.fn(),
    };
    emailJobService = {
      sendBookingApprovedEmail: jest.fn(),
      sendPayoutReceivedEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcceptBookingUseCase,
        PickupBookingUseCase,
        { provide: BookingRepository, useValue: bookingRepo },
        { provide: WalletService, useValue: walletService },
        { provide: ItemRepository, useValue: {} },
        { provide: UserRepository, useValue: {} },
        { provide: EmailJobService, useValue: emailJobService },
        {
          provide: DRIZZLE,
          useValue: {
            transaction: jest.fn((cb) => cb('tx')),
          },
        },
      ],
    }).compile();

    acceptBookingUseCase = module.get<AcceptBookingUseCase>(AcceptBookingUseCase);
    pickupBookingUseCase = module.get<PickupBookingUseCase>(PickupBookingUseCase);
  });

  describe('AcceptBookingUseCase', () => {
    it('should accept booking if available', async () => {
      bookingRepo.findBookingById.mockResolvedValue({
        ...mockBooking,
        item: { ...mockBooking.item, isAvailable: true },
      });
      bookingRepo.checkAvailability.mockResolvedValue(true);

      await acceptBookingUseCase.execute('booking-1', 'owner-1');

      expect(bookingRepo.checkAvailability).toHaveBeenCalled();
      expect(bookingRepo.acceptBooking).toHaveBeenCalled();
      expect(walletService.transferFunds).not.toHaveBeenCalled(); // Should NOT transfer funds
      expect(emailJobService.sendBookingApprovedEmail).toHaveBeenCalled();
    });

    it('should throw if item is marked unavailable by owner', async () => {
      bookingRepo.findBookingById.mockResolvedValue({
        ...mockBooking,
        item: { ...mockBooking.item, isAvailable: false },
      });

      await expect(
        acceptBookingUseCase.execute('booking-1', 'owner-1'),
      ).rejects.toThrow(BadRequestException);

      expect(bookingRepo.acceptBooking).not.toHaveBeenCalled();
    });

    it('should throw if item is not available (dates overlap)', async () => {
      bookingRepo.findBookingById.mockResolvedValue({
        ...mockBooking,
        item: { ...mockBooking.item, isAvailable: true },
      });
      bookingRepo.checkAvailability.mockResolvedValue(false);

      await expect(
        acceptBookingUseCase.execute('booking-1', 'owner-1'),
      ).rejects.toThrow(BadRequestException);

      expect(bookingRepo.acceptBooking).not.toHaveBeenCalled();
    });

    it('should throw if user is not owner', async () => {
      bookingRepo.findBookingById.mockResolvedValue(mockBooking);

      await expect(
        acceptBookingUseCase.execute('booking-1', 'other-user'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('PickupBookingUseCase', () => {
    it('should transfer funds and mark as picked up', async () => {
      const acceptedBooking = { ...mockBooking, status: 'accepted' };
      bookingRepo.findBookingById.mockResolvedValue(acceptedBooking);

      await pickupBookingUseCase.execute('booking-1', 'borrower-1');

      expect(walletService.transferFunds).toHaveBeenCalledWith(
        'borrower-1',
        'owner-1',
        1000,
        'booking-1',
        'tx',
        'Test Item',
      );
      expect(emailJobService.sendPayoutReceivedEmail).toHaveBeenCalled();
      expect(bookingRepo.updateBookingStatus).toHaveBeenCalledWith(
        'booking-1',
        'picked_up',
        'tx',
      );
    });

    it('should throw if user is not borrower', async () => {
      const acceptedBooking = { ...mockBooking, status: 'accepted' };
      bookingRepo.findBookingById.mockResolvedValue(acceptedBooking);

      await expect(
        pickupBookingUseCase.execute('booking-1', 'other-user'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if booking is not accepted', async () => {
      bookingRepo.findBookingById.mockResolvedValue(mockBooking); // status is pending

      await expect(
        pickupBookingUseCase.execute('booking-1', 'borrower-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
