import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { phone, password }: LoginDto) {
    return this.authService.login(phone, password);
  }

  @Post('send-signup-code')
  sendVerificationCode(@Body() { phone }: any) {
    return this.authService.sendVerificationCode(phone);
  }

  @Post('signup')
  async verifyCodeAndSignUp(@Body() dto: any) {
    return this.authService.verifyCodeAndSignUp(
      dto.phone,
      dto.code,
      dto.password,
      dto.name,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async authMe(@Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    return this.authService.authMe(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { phone }: any) {
    return this.authService.forgotPassword(phone);
  }

  @Patch('reset-password')
  async resetPassword(@Body() { phone, code, newPassword }: any) {
    return this.authService.resetPassword(phone, code, newPassword);
  }

  // @Post('sign-up')
  // signUp(@Body() { phone, password, name }: SignUpDto) {
  //   return this.authService.signUp(phone, password, name);
  // }
}
