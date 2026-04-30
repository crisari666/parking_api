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

  /** Verifies signature and claims except expiry; rejects if expired beyond grace window (matches JWT TTL). */
  async validateTokenAllowExpired(token: string): Promise<any> {
    if (!token) {
      throw new Error('No token provided');
    }

    const graceSeconds = 7 * 24 * 60 * 60;

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.publicKey,
        { algorithms: ['RS256'], ignoreExpiration: true },
        (err, payload: jwt.JwtPayload) => {
          if (err) {
            reject(new Error('Invalid token'));
            return;
          }
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp !== undefined && now > payload.exp + graceSeconds) {
            reject(new Error('Token too old to renew'));
            return;
          }
          resolve(payload);
        },
      );
    });
  }
} 