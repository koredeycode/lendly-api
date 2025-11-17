import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { type ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const issues = result.error.issues.map(
        (i) => `${i.path.join('.')} - ${i.message}`,
      );
      throw new BadRequestException(issues);
    }
    return result.data;
  }
}
