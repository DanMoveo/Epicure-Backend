import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');

    const token = req.headers.authorization?.split(' ')[1];
    console.log('the token is:', token);
    
    try {
      if (token) {
        const decodedToken = jwt.decode(token) as { roles: string[] }; 
        console.log('the decodedToken is:', decodedToken.roles);
        
        if (decodedToken && decodedToken.roles.includes('superAdmin')) {
          console.log('User has the superAdmin role.');
          next();
        } else {
          console.log('User does not have the superAdmin role.');
          res.status(403).send('Access denied: You do not have the superAdmin role.');
        }
      }
    } catch (error) {
      console.error('Error decoding or verifying the token:', error);
      res.status(401).send('Unauthorized: Invalid token or token expired.');
    }
  }
}
