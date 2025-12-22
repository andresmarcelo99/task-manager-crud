import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { CognitoService } from './cognito.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let cognitoService: CognitoService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    cognitoId: 'cognito-123',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockCognitoService = {
    signUp: jest.fn(),
    confirmSignUp: jest.fn(),
    signIn: jest.fn(),
    getUserInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: CognitoService,
          useValue: mockCognitoService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    cognitoService = module.get<CognitoService>(CognitoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockCognitoService.signUp.mockResolvedValue({
        UserSub: 'cognito-123',
      });

      const result = await service.register(registerDto);

      expect(mockCognitoService.signUp).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
      expect(result.message).toContain('registered successfully');
    });

    it('should throw UnauthorizedException on registration failure', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockCognitoService.signUp.mockRejectedValue(new Error('Registration failed'));

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser({ sub: 'user-1' });

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.validateUser({ sub: 'nonexistent' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});