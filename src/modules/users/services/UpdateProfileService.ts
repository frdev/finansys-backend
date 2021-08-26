import { injectable, inject } from "tsyringe";
import { classToClass } from "class-transformer";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IHashProvider from "@shared/container/providers/HashProvider/models/IHashProvider";
import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    let user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError("Usuário não encontrado");

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id)
      throw new AppError("E-mail já em uso");

    const updatedUser = { ...user, name, email };

    if (password) {
      if (!old_password)
        throw new AppError("Senha antiga é necessária para atualização");

      const validOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!validOldPassword) throw new AppError("Credenciais inválidas");

      updatedUser.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(updatedUser as User);

    user = (await this.usersRepository.findById(user_id)) as User;

    return classToClass(user);
  }
}

export default UpdateProfileService;
