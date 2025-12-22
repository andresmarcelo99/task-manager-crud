import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { CognitoService } from './cognito.service';
import { RegisterDto, LoginDto, ConfirmSignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cognitoService: CognitoService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    try {
      const cognitoResponse = await this.cognitoService.signUp(email, password, name);
      
      return {
        message: 'User registered successfully. Please check your email for verification code.',
        userSub: cognitoResponse.UserSub,
      };
    } catch (error) {
      throw new UnauthorizedException(`Registration failed: ${error.message}`);
    }
  }

  async confirmSignUp(confirmSignUpDto: ConfirmSignUpDto) {
    const { email, confirmationCode } = confirmSignUpDto;

    try {
      await this.cognitoService.confirmSignUp(email, confirmationCode);
      return { message: 'Email confirmed successfully. You can now sign in.' };
    } catch (error) {
      throw new UnauthorizedException(`Email confirmation failed: ${error.message}`);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      console.log('🔐 Attempting login for:', email);
      const cognitoResponse = await this.cognitoService.signIn(email, password);
      console.log('📝 Cognito response:', JSON.stringify(cognitoResponse, null, 2));
      
      if (!cognitoResponse.AuthenticationResult) {
        console.log('❌ No AuthenticationResult in response');
        throw new UnauthorizedException('Authentication failed - no auth result');
      }

      const { AccessToken, RefreshToken } = cognitoResponse.AuthenticationResult;

      // Get user info from Cognito
      const userInfo = await this.cognitoService.getUserInfo(AccessToken);
      const cognitoId = userInfo.Username;
      const userEmail = userInfo.UserAttributes?.find(attr => attr.Name === 'email')?.Value || email;
      const userName = userInfo.UserAttributes?.find(attr => attr.Name === 'name')?.Value;

      // Create or update user in our database
      let user = await this.prisma.user.findUnique({
        where: { cognitoId },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            cognitoId,
            email: userEmail,
            name: userName,
          },
        });
      }

      // Generate our own JWT token
      const payload = { 
        sub: user.id, 
        email: user.email,
        cognitoId: user.cognitoId 
      };
      
      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        refresh_token: RefreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.name || error.__type);
      
      if (error.name === 'UserNotConfirmedException') {
        throw new UnauthorizedException('Please confirm your email before signing in. Check your inbox for a confirmation code.');
      }
      
      throw new UnauthorizedException(`Login failed: ${error.message}`);
    }
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}