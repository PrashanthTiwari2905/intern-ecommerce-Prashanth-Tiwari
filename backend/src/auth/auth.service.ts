import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import {
  SignupResponse,
  LoginResponse,
} from './auth.types';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly jwtService: JwtService,
) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<SignupResponse> {
    const { name, email, password } = signupDto;

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      message: 'User created successfully',
    };
  }


  async login(
  loginDto: LoginDto,
): Promise<LoginResponse> {
  const { email, password } = loginDto;

  const user =
    await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new UnauthorizedException(
      'Invalid credentials',
    );
  }

  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password,
    );

  if (!isPasswordCorrect) {
    throw new UnauthorizedException(
      'Invalid credentials',
    );
  }

  const payload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken =
    await this.jwtService.signAsync(
      payload,
    );

  return {
    accessToken,
  };
}
}


