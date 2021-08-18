export default interface IHashProvider {
  generateHash(payload: string, size?: number): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}
