import { hash, compare } from "bcryptjs";
import IHashProvider from "../models/IHashProvider";

class BCryptHashProvider implements IHashProvider {
  public async generateHash(
    payload: string,
    size: number = 8
  ): Promise<string> {
    return hash(payload, size);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashProvider;
