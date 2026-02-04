import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportContact } from './models/support-contact.interface';

@ApiTags('support')
@Controller('support')
export class SupportController {
  @Get('contacts')
  @ApiOperation({ summary: 'Get support contacts' })
  @ApiOkResponse({ description: 'Support contacts list.' })
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
  @ApiOperation({ summary: 'Admin smoke test endpoint' })
  @ApiOkResponse({ description: 'Endpoint reachable.' })
  public getAdminTest(): { readonly ok: true } {
    return { ok: true } as const;
  }
}
