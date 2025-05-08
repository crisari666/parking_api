import {Injectable, NestMiddleware } from "@nestjs/common";
import { TokenValidationService } from './token-validation.service';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(private readonly tokenValidationService: TokenValidationService) {}
  
  async use(req: any, res, next: () => void) {
    try { 
      const baseUrl = req.baseUrl             
      if(baseUrl.includes('/.well-known/jwks.json') || (req.body.query != undefined && req.body.query.includes('logIn')) || baseUrl.includes('credit-request') || baseUrl.includes('getCollectionsInfo')) return next() 
        
      console.log({baseUrl});
      
      
      const token = req.headers.authorization?.split(' ')[1];
      
      try {
        const payload = await this.tokenValidationService.validateToken(token);
        console.log({payload});
        req.headers.user = payload;
        next();
      } catch (error) {
        console.error('Token validation error:', error);
        return res.status(401).json({ error: 'Not authorized' });
      }
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Not authorized' });
    }
  }
}