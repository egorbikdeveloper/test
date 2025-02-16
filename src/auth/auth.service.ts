//src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(phone: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      throw new NotFoundException(`No user found for phone: ${phone}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async sendVerificationCode(phone: string): Promise<{ message: string }> {
    // const verificationCode = Math.floor(
    //   100000 + Math.random() * 900000,
    // ).toString();

    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException(`User with phone ${phone} already exists`);
    }

    const verificationCode = '111111';

    //await this.cacheManager.set(`verification:${phone}`, verificationCode, 300);

    console.log(`📩 Отправлен код: ${verificationCode} на номер ${phone}`);

    return {
      message: `📩 Отправлен код: ${verificationCode} на номер ${phone}`,
    };
    return { message: 'Verification code sent successfully' };
  }

  async verifyCodeAndSignUp(
    phone: string,
    code: string,
    password: string,
    name: string,
  ): Promise<AuthEntity> {
    const storedCode = '111111';

    if (!storedCode || storedCode !== code) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException(`User with phone ${phone} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { phone, password: hashedPassword, name },
    });

    //await this.cacheManager.del(`verification:${phone}`);

    return { accessToken: this.jwtService.sign({ userId: user.id }) };
  }

  async authMe(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      const userId = decoded.userId;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error: any) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async forgotPassword(phone: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const verificationCode = Math.floor(
    //   100000 + Math.random() * 900000,
    // ).toString();

    const verificationCode = '222222';

    // await this.cacheManager.set(`verification:${phone}`, verificationCode, {
    //   ttl: 600,
    // });

    // await this.smsService.sendSms(
    //   phone,
    //   `Your verification code is: ${verificationCode}`,
    // );

    return `Your verification code is: ${verificationCode}`;
    return 'Verification code sent successfully';
  }

  async resetPassword(
    phone: string,
    code: string,
    newPassword: string,
  ): Promise<string> {
    const cachedCode = '222222';

    if (!cachedCode || cachedCode !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { phone },
      data: { password: hashedPassword },
    });

    //await this.cacheManager.del(`verification:${phone}`);

    return 'Password has been reset successfully';
  }

  //   async signUp(
  //     phone: string,
  //     password: string,
  //     name: string,
  //   ): Promise<AuthEntity> {
  //     if (!name) {
  //       throw new ConflictException(`Имя отсутствует`);
  //     }

  //     const existingUser = await this.prisma.user.findUnique({
  //       where: { phone },
  //     });

  //     if (existingUser) {
  //       throw new ConflictException(`User with phone ${phone} already exists`);
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     const user = await this.prisma.user.create({
  //       data: {
  //         phone,
  //         password: hashedPassword,
  //         name,
  //       },
  //     });

  //     return {
  //       accessToken: this.jwtService.sign({ userId: user.id }),
  //     };
  //   }
}
