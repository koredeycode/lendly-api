import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction')
@Controller('transactions')
export class TransactionController {
  constructor() {}
}
