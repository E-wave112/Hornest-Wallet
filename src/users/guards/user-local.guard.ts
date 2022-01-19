import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class userLocalGuard extends AuthGuard('local') {}
