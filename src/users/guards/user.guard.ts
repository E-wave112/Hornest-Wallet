import { AuthGuard } from '@nestjs/passport';

export class UserAuthGuard extends AuthGuard('jwt') {}
