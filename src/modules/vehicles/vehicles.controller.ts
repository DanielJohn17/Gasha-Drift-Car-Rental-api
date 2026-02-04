import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehicleEntity } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/modules/users/enums/user-role.enum';

@Controller('vehicles')
export class VehiclesController {
  public constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  public listVehicles(
    @Query('location') location?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<VehicleEntity[]> {
    return this.vehiclesService.listVehicles({ location, type, status, startDate, endDate });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get('admin/test')
  public getAdminTest(): { readonly ok: true } {
    return { ok: true } as const;
  }

  @Get(':id')
  public getVehicleById(@Param('id') id: string): Promise<VehicleEntity> {
    return this.vehiclesService.getVehicleById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Post()
  public createVehicle(@Body() body: CreateVehicleDto): Promise<VehicleEntity> {
    return this.vehiclesService.createVehicle(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Patch(':id')
  public updateVehicle(@Param('id') id: string, @Body() body: UpdateVehicleDto): Promise<VehicleEntity> {
    return this.vehiclesService.updateVehicle(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  public async deleteVehicle(@Param('id') id: string): Promise<{ readonly deleted: true }> {
    await this.vehiclesService.deleteVehicle(id);
    return { deleted: true } as const;
  }
}
