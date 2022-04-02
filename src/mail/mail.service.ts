import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import templates from './templates';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class MailService {
  sender_email = this.configService.get<string>('SENDER_EMAIL');
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(templateName: string, user: User, data = {}) {
    const { email, firstName, lastName } = user;
    const template = templates(firstName, lastName, data)[templateName];

    await SendGrid.send({
      to: email,
      from: this.sender_email,
      subject: template.subject,
      text: template.subject,
      html: template.html,
    });
  }
  async sendMultipleEmail(templateName: string, users: User[], data = {}) {
    let users_list = [];
    for (const user of users) {
      const template = templates(user.firstName, user.lastName, data)[
        templateName
      ];

      users_list.push({
        to: user.email,
        from: this.sender_email,
        subject: template.subject,
        text: template.subject,
        html: template.html,
      });
    }

    await SendGrid.send(users_list);
  }
}
