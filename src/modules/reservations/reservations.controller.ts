import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { JwtUser } from '@/modules/auth/models/jwt-user.interface';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/modules/users/enums/user-role.enum';
import { UpdateReservationStatusDto } from './dtos/update-reservation-status.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  public constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Customer)
  @Post()
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create reservation (customer)' })
  @ApiOkResponse({ description: 'Reservation created.' })
  public createReservation(
    @Req() request: { readonly user: JwtUser },
    @Body() body: CreateReservationDto,
  ): Promise<ReservationEntity> {
    return this.reservationsService.createReservation(request.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'List reservations (admin sees all; customer sees own)' })
  @ApiOkResponse({ description: 'Reservations list.' })
  public listReservations(@Req() request: { readonly user: JwtUser }): Promise<ReservationEntity[]> {
    const isAdmin: boolean = request.user.role === UserRole.Admin;
    return this.reservationsService.listReservations({ userId: request.user.userId, isAdmin });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get('admin/test')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Admin smoke test endpoint' })
  @ApiOkResponse({ description: 'Admin guard OK.' })
  public getAdminTest(): { readonly ok: true } {
    return { ok: true } as const;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get reservation by ID (admin or owner)' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Reservation details.' })
  public async getReservationById(
    @Req() request: { readonly user: JwtUser },
    @Param('id') id: string,
  ): Promise<ReservationEntity> {
    const reservation: ReservationEntity = await this.reservationsService.getReservationById(id);
    const isAdmin: boolean = request.user.role === UserRole.Admin;
    if (isAdmin) {
      return reservation;
    }
    if (reservation.customerUserId !== request.user.userId) {
      throw new ForbiddenException('You do not have access to this reservation.');
    }
    return reservation;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Patch(':id/status')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update reservation status (admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Reservation status updated.' })
  public updateReservationStatus(
    @Param('id') id: string,
    @Body() body: UpdateReservationStatusDto,
  ): Promise<ReservationEntity> {
    return this.reservationsService.updateReservationStatus(id, body.status);
  }
}
