import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehicleEntity } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/modules/users/enums/user-role.enum';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  public constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles (optionally filter by availability date range)' })
  @ApiOkResponse({ description: 'Vehicles list.' })
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
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Admin smoke test endpoint' })
  @ApiOkResponse({ description: 'Admin guard OK.' })
  public getAdminTest(): { readonly ok: true } {
    return { ok: true } as const;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Vehicle details.' })
  public getVehicleById(@Param('id') id: string): Promise<VehicleEntity> {
    return this.vehiclesService.getVehicleById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Post()
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create vehicle (admin)' })
  @ApiOkResponse({ description: 'Vehicle created.' })
  public createVehicle(@Body() body: CreateVehicleDto): Promise<VehicleEntity> {
    return this.vehiclesService.createVehicle(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Patch(':id')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update vehicle (admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Vehicle updated.' })
  public updateVehicle(@Param('id') id: string, @Body() body: UpdateVehicleDto): Promise<VehicleEntity> {
    return this.vehiclesService.updateVehicle(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete vehicle (admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Vehicle deleted.' })
  public async deleteVehicle(@Param('id') id: string): Promise<{ readonly deleted: true }> {
    await this.vehiclesService.deleteVehicle(id);
    return { deleted: true } as const;
  }
}
