import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";
import AppError from "@shared/errors/AppError";
import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";
import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
  filename: string;
}

@injectable()
class UpdateAvatarUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user)
      throw new AppError(
        "Somente usuários autenticados conseguem alterar o avatar",
        401
      );

    if (user.avatar) await this.storageProvider.deleteFile(user.avatar);

    user.avatar = filename;

    await this.usersRepository.save(user);

    return classToClass(user);
  }
}

export default UpdateAvatarUserService;
