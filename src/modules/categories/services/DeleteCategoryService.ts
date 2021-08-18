import { injectable, inject } from "tsyringe";
import ICategoriesRepository from "../repositories/ICategoriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import AppError from "@shared/errors/AppError";

interface IRequest {
  category_id: string;
  user_id: string;
}

@injectable()
class DeleteCategoryService {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id, category_id }: IRequest): Promise<void> {
    const category = await this.categoriesRepository.findById(category_id);

    if (!category || category.user_id !== user_id)
      throw new AppError("Categoria inexistente.", 400);

    await this.categoriesRepository.delete(category_id);

    await this.cacheProvider.invalidate(`categories-list:${user_id}`);
  }
}

export default DeleteCategoryService;
