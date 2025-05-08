import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class TokenValidationService {
  private publicKey: string;

  constructor() {
    this.publicKey = fs.readFileSync(join(process.cwd(), 'keys/public.pem'), 'utf8');
  }

  async validateToken(token: string): Promise<any> {
    if (token === process.env.AUTH_TOKEN_MS) {
      return true;
    }

    if (!token) {
      throw new Error('No token provided');
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }, (err, payload) => {
        if (err) {
          reject(new Error('Expired or invalid token'));
        }
        resolve(payload);
      });
    });
  }
} 