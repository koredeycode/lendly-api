import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   canActivate(context: ExecutionContext) {
//     console.log('JwtAuthGuard triggered');
//     return super.canActivate(context);
//   }

//   handleRequest(err, user, info, context: ExecutionContext) {
//     console.log({ err, user, info });
//     return super.handleRequest(err, user, info, context);
//   }
// }
