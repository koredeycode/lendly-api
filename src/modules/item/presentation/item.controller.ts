import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Item')
@Controller('items')
export class ItemController {
  constructor() {}
}
