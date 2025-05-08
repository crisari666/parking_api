import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

@Injectable()
export class PasswordUtil {
  private readonly hash: 'qp_api_key';
  
  hashString(value: string)  {
    return createHash('sha256').update(value, "binary").digest("hex");
  }

  generateToken({userId, date} : {userId: string, date: string}) {
    return this.hashString(`${userId}${date}${this.hash}`);
  }
}