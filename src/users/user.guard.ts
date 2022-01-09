import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export class UserAuthGuard extends AuthGuard('jwt') {}
