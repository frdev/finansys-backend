import { injectable, inject } from "tsyringe";
import ICategoriesRepository from "../repositories/ICategoriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import AppError from "@shared/errors/AppError";

@injectable()
class DeleteCategoryService {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute(category_id: string): Promise<void> {
    const category = await this.categoriesRepository.findById(category_id);

    console.log(category);

    if (!category) throw new AppError("Categoria inexistente.", 400);

    await this.categoriesRepository.delete(category_id);

    await this.cacheProvider.invalidatePrefix("categories-list");
  }
}

export default DeleteCategoryService;
