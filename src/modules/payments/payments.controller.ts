import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { JwtUser } from '@/modules/auth/models/jwt-user.interface';
import { UserRole } from '@/modules/users/enums/user-role.enum';
import { VerifyPaymentProofDto } from './dtos/verify-payment-proof.dto';
import { PaymentProofEntity } from './entities/payment-proof.entity';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class PaymentsController {
  public constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  public listPaymentProofs(): Promise<PaymentProofEntity[]> {
    return this.paymentsService.listPaymentProofs();
  }

  @Patch(':id/verify')
  public verifyPaymentProof(
    @Req() request: { readonly user: JwtUser },
    @Param('id') id: string,
    @Body() body: VerifyPaymentProofDto,
  ): Promise<PaymentProofEntity> {
    return this.paymentsService.verifyPaymentProof(id, { adminUserId: request.user.userId, status: body.status });
  }

  @Get('admin/test')
  public getAdminTest(): { readonly ok: true } {
    return { ok: true } as const;
  }
}
