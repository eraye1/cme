import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { TokenResponse, JwtPayload } from './types/auth.types';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const user = await this.validateUser(email, password);
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: { token: refreshToken, userId: payload.sub },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const newPayload: JwtPayload = { sub: payload.sub, email: payload.email };
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAsync(newPayload),
        this.jwtService.signAsync(newPayload, { expiresIn: '7d' }),
      ]);

      // Rotate refresh token
      await this.prisma.$transaction([
        this.prisma.refreshToken.delete({ where: { id: storedToken.id } }),
        this.prisma.refreshToken.create({
          data: { token: newRefreshToken, userId: payload.sub },
        }),
      ]);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { 
          userId,
          token: refreshToken,
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still consider logout successful even if token cleanup fails
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      // Check if user exists first
      const existingUser = await this.prisma.user.findUnique({
        where: { email: signupDto.email },
      });

      if (existingUser) {
        throw new ConflictException('An account with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
      
      const user = await this.prisma.user.create({
        data: {
          email: signupDto.email,
          password: hashedPassword,
          name: signupDto.name,
          licenseNumber: signupDto.licenseNumber,
          specialty: signupDto.specialty,
          licenseType: signupDto.licenseType,
          states: signupDto.states || [],
          credentials: [],
        },
        select: {
          id: true,
          email: true,
          name: true,
          licenseNumber: true,
          specialty: true,
          licenseType: true,
          states: true,
          credentials: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const tokens = await this.generateTokens(user.id);
      return { user, ...tokens };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('An account with this email already exists');
      }
      throw error;
    }
  }

  async generateTokens(userId: string) {
    const payload: JwtPayload = { sub: userId, email: '' };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        licenseNumber: true,
        specialty: true,
        licenseType: true,
        states: true,
        credentials: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
} 