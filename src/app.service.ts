import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHealth(): { readonly status: 'ok' } {
    return { status: 'ok' } as const;
  }
}
