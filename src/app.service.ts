import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to hornest wallet!, please go to this url https://documenter.getpostman.com/view/11690328/UVe9S9cc to view our documentation';
  }
}
