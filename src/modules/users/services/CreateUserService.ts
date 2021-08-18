import { inject, injectable } from "tsyringe";
import IUsersRepository from "../repositories/IUsersRepository";
import IHashProvider from "@shared/container/providers/HashProvider/models/IHashProvider";
import ICreateUserDTO from "../dtos/ICreateUserDTO";
import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";

@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const findUser = await this.usersRepository.findByEmail(email);

    if (findUser) throw new AppError("Email já está sendo utilizado", 400);

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
