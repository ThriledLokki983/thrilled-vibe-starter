# Node.js Express Backend Development Instructions

## Project Overview
Create a robust Node.js backend API using Express.js with TypeScript, following modern best practices for scalability, security, and maintainability.

## Technology Stack

### Core Technologies
- **Node.js** (v18+ LTS) - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type safety and enhanced developer experience
- **PostgreSQL** - Primary database (with Prisma ORM)
- **Redis** - Caching and session storage
- **JWT** - Authentication and authorization

### Database & ORM
- **Prisma** - Modern database toolkit and ORM
- **PostgreSQL** - Relational database
- **Redis** - In-memory cache and session store

### Validation & Security
- **Zod** - Runtime type validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing
- **bcrypt** - Password hashing

### Development Tools
- **nodemon** - Development server with hot reload
- **Jest** - Testing framework
- **ESLint** + **Prettier** - Code quality and formatting
- **Swagger/OpenAPI** - API documentation
- **Docker** - Containerization

### Package Management
- **npm** or **yarn** (prefer yarn for consistency)

## Project Structure

```
project-name/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── models/
│   │   └── (Prisma generated types)
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── email.service.ts
│   │   └── cache.service.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── common.types.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── app.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── utils/
├── docs/
│   └── api-spec.yaml
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Initial Setup

### 1. Project Initialization
```bash
# Create project directory
mkdir project-name && cd project-name

# Initialize package.json
yarn init -y

# Install core dependencies
yarn add express cors helmet morgan compression
yarn add prisma @prisma/client redis ioredis
yarn add jsonwebtoken bcryptjs zod
yarn add winston express-rate-limit
yarn add swagger-jsdoc swagger-ui-express

# Install TypeScript and development dependencies
yarn add -D typescript @types/node @types/express
yarn add -D @types/cors @types/morgan @types/compression
yarn add -D @types/jsonwebtoken @types/bcryptjs
yarn add -D @types/swagger-jsdoc @types/swagger-ui-express
yarn add -D nodemon ts-node eslint prettier
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
yarn add -D jest @types/jest ts-jest supertest @types/supertest
```

### 2. Configuration Files

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/controllers/*": ["src/controllers/*"],
      "@/middleware/*": ["src/middleware/*"],
      "@/services/*": ["src/services/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**package.json scripts**
```json
{
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write src/**/*.ts",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

**nodemon.json**
```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/app.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### 3. Environment Configuration

**.env.example**
```bash
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="30d"

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Database Setup with Prisma

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  firstName String?
  lastName  String?
  avatar    String?
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  sessions Session[]
  posts    Post[]

  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("posts")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

## Application Architecture

### Main Application Setup
```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import routes from './routes';
import { connectDatabase } from './utils/database';
import { connectRedis } from './utils/redis';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

export default app;
```

### Database Connection
```typescript
// src/utils/database.ts
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
```

### Redis Connection
```typescript
// src/utils/redis.ts
import Redis from 'ioredis';
import { logger } from './logger';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

export async function connectRedis(): Promise<void> {
  try {
    await redis.ping();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
}

redis.on('error', (error) => {
  logger.error('Redis error:', error);
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('disconnect', () => {
  logger.warn('Redis disconnected');
});
```

## Authentication & Authorization

### JWT Service
```typescript
// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/utils/database';
import { redis } from '@/utils/redis';
import { User } from '@prisma/client';
import { AuthTokens, LoginCredentials, RegisterData } from '@/types/auth.types';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  async register(data: RegisterData): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(user.id);
    
    return {
      user: this.excludePassword(user),
      tokens,
    };
  }

  async login(credentials: LoginCredentials): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: credentials.identifier },
          { username: credentials.identifier },
        ],
      },
    });

    if (!user || !await bcrypt.compare(credentials.password, user.password)) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const tokens = await this.generateTokens(user.id);
    
    return {
      user: this.excludePassword(user),
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { userId: string };
      
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(payload.userId);
      
      // Update session with new refresh token
      await prisma.session.update({
        where: { id: session.id },
        data: {
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  private async generateTokens(userId: string): Promise<AuthTokens> {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.JWT_REFRESH_EXPIRES_IN }
    );

    // Store refresh token in database
    await prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return { accessToken, refreshToken };
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
```

### Authentication Middleware
```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@/utils/database';
import { redis } from '@/utils/redis';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const token = authHeader.substring(7);
    
    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      res.status(401).json({ error: 'Token has been revoked' });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      type: string;
    };

    if (payload.type !== 'access') {
      res.status(401).json({ error: 'Invalid token type' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'User not found or inactive' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
```

## Input Validation

### Validation Middleware with Zod
```typescript
// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Example validation schemas
export const authSchemas = {
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      username: z.string().min(3, 'Username must be at least 3 characters'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
  }),
  
  login: z.object({
    body: z.object({
      identifier: z.string().min(1, 'Email or username is required'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),
};
```

## Error Handling

### Global Error Middleware
```typescript
// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Handle specific error types
  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = handlePrismaError(error);
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): string {
  switch (error.code) {
    case 'P2002':
      return 'A record with this value already exists';
    case 'P2025':
      return 'Record not found';
    case 'P2003':
      return 'Foreign key constraint failed';
    default:
      return 'Database operation failed';
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Resource not found',
    path: req.path,
  });
};
```

## API Controllers

### User Controller Example
```typescript
// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';
import { CustomError } from '@/middleware/error.middleware';

export class UserController {
  private userService = new UserService();

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new CustomError('User not authenticated', 401);
      }

      const user = await this.userService.getUserById(userId);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new CustomError('User not authenticated', 401);
      }

      const updatedUser = await this.userService.updateUser(userId, req.body);
      res.json({ 
        message: 'Profile updated successfully',
        data: updatedUser 
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      const result = await this.userService.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
```

## Testing

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Test Example
```typescript
// tests/controllers/auth.controller.test.ts
import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/utils/database';

describe('Auth Controller', () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data).toHaveProperty('tokens');
    });

    it('should return error for duplicate email', async () => {
      // Create user first
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: 'hashedpassword',
        },
      });

      const userData = {
        email: 'test@example.com',
        username: 'newuser',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
```

## Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    volumes:
      - .env:/app/.env

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: username
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Quality Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint configured and passing
- [ ] Prettier formatting applied
- [ ] No console.log statements in production
- [ ] Proper error handling implemented
- [ ] Input validation with Zod schemas

### Security
- [ ] JWT authentication implemented
- [ ] Password hashing with bcrypt
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Helmet security headers
- [ ] Input sanitization
- [ ] SQL injection prevention (Prisma ORM)

### Performance
- [ ] Database queries optimized
- [ ] Redis caching implemented
- [ ] Connection pooling configured
- [ ] Request compression enabled
- [ ] Proper indexing on database

### Testing
- [ ] Unit tests for services
- [ ] Integration tests for controllers
- [ ] API endpoint tests
- [ ] Error handling tests
- [ ] Authentication tests
- [ ] 80%+ code coverage

### Documentation
- [ ] API documentation with Swagger
- [ ] README with setup instructions
- [ ] Environment variables documented
- [ ] Database schema documented
- [ ] Deployment instructions

### Monitoring & Logging
- [ ] Structured logging with Winston
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Health check endpoint
- [ ] Database migration strategy

This comprehensive guide ensures a production-ready Node.js Express API with TypeScript that follows industry best practices for security, scalability, and maintainability.
