import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import IHashProvider from "@shared/container/providers/HashProvider/models/IHashProvider";
import IUsersRepository from "../repositories/IUsersRepository";
import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";
import authConfig from "@config/auth";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError("Usuário/senha incorretos", 401);

    const passwordMatched = this.hashProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatched) throw new AppError("Usuário/senha incorretos", 401);

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, { subject: user.id, expiresIn });

    return { user, token };
  }
}

export default AuthUserService;
