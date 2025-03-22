import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SigninDto } from './dto/sign-in.dto';
import { IsPublic } from 'src/shared/decorators/isPublic';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('/signup')
  signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }
}
