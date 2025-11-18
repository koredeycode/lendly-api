import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../domain/booking.repository';

@Injectable()
export class DrizzleBookingRepository implements BookingRepository {}
