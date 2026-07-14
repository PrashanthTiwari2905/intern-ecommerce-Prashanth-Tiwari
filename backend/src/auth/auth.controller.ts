import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

@ApiOperation({
  summary: 'Register a new user',
  description:
    'Create a new user account.',
})  

  @Post('signup')
  signup(
    @Body() signupDto: SignupDto,
  ) {
    return this.authService.signup(
      signupDto,
    );
  }

  @ApiOperation({
  summary: 'Login user',
  description:
    'Authenticate a user and return a JWT token.',
})
@Post('login')
login(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(
      loginDto,
    );
  }


@ApiBearerAuth()
@ApiOperation({
  summary: 'Get current user profile',
  description:
    'Returns the profile of the logged in user.',
})
@Get('profile')
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @GetUser() user: any,
  ) {
    return user;
  }
}