import { Controller, Get } from '@nestjs/common';
import { SupportContact } from './models/support-contact.interface';

@Controller('support')
export class SupportController {
  @Get('contacts')
  public getContacts(): SupportContact[] {
    return [
      {
        id: 'a1',
        name: 'Abenezer Mengesha',
        role: 'Customer Support & Admin',
        email: 'abenezermengesha6@gmail.com',
        phone: '+251923139919',
      },
    ];
  }

  @Get('admin/test')
  public getAdminTest(): { readonly ok: true } {
    return { ok: true } as const;
  }
}
