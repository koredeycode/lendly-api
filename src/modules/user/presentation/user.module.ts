import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateUserUseCase } from '../application/create-user.usecase';
import { EditUserUseCase } from '../application/edit-user.usecase';
import { UserService } from '../application/user.service';
import { UserRepository } from '../domain/user.repository';
import { DrizzleUserRepository } from '../infrastructure/user.repository.drizzle';
import { UserController } from './user.controller';

@Module({
  imports: [JobsModule],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserUseCase,
    EditUserUseCase,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
