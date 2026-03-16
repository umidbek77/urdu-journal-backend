import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new author account' })
  @ApiBody({
    schema: {
      example: {
        name: 'Umidbek Zaripov',
        email: 'umidjon@test.com',
        password: '12345678',
        affiliation: 'TATU University',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      affiliation?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and receive JWT token' })
  @ApiBody({
    schema: {
      example: {
        email: 'umidjon@test.com',
        password: '12345678',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'JWT_TOKEN',
      },
    },
  })
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
}
