import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
  private cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_COGNITO_REGION');
    this.userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID');

    this.cognitoClient = new CognitoIdentityProviderClient({
      region,
    });
  }

  async signUp(email: string, password: string, name?: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        ...(name ? [{ Name: 'name', Value: name }] : []),
      ],
    });

    return await this.cognitoClient.send(command);
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
    });

    return await this.cognitoClient.send(command);
  }

  async signIn(email: string, password: string) {
    try {
      console.log('🔑 Cognito signIn attempt for:', email);
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH', // Back to USER_PASSWORD_AUTH
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const result = await this.cognitoClient.send(command);
      console.log('✅ Cognito signIn success');
      return result;
    } catch (error) {
      console.error('❌ Cognito signIn error:', error);
      throw error;
    }
  }

  async getUserInfo(accessToken: string) {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    return await this.cognitoClient.send(command);
  }
}