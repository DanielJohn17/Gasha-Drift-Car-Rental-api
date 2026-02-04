import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthTokenResponse } from './models/auth-token-response.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtUser } from './models/jwt-user.interface';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from '@/modules/users/enums/user-role.enum';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new customer user' })
  @ApiOkResponse({ description: 'Registration succeeded.' })
  public register(@Body() body: RegisterDto): Promise<AuthTokenResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT token' })
  @ApiOkResponse({ description: 'Login succeeded.' })
  public login(@Body() body: LoginDto): Promise<AuthTokenResponse> {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Current user profile.' })
  public async getMe(@Req() request: { readonly user: JwtUser }): Promise<AuthTokenResponse['user']> {
    return this.authService.getProfile(request.user.userId);
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
}
