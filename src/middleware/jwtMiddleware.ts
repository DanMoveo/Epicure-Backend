import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {} // Inject ConfigService

  use(req: Request, res: Response, next: NextFunction) {
    // Extract the token from the request headers or cookies
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader
      ? authorizationHeader.split(' ')[1]
      : undefined;   

    if (!token) {
      // Handle unauthorized access
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token using the JWT secret from ConfigService
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = verify(token, jwtSecret);
      // Attach the decoded user information to the request for later use
      req['user'] = decoded;
      next();
    } catch (error) {
      // Handle token verification errors
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}
