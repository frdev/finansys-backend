import { injectable, inject } from "tsyringe";
import Category from "@modules/categories/infra/typeorm/entities/Category";
import ICategoriesRepository from "../repositories/ICategoriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import AppError from "@shared/errors/AppError";
import ICreateCategoryDTO from "../dtos/ICreateCategoryDTO";

@injectable()
class CreateCategoryService {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    name,
    user_id,
  }: ICreateCategoryDTO): Promise<Category> {
    let category = await this.categoriesRepository.findByNameAndUserId({
      name,
      user_id,
    });

    if (category) throw new AppError("Categoria ja existente.", 400);

    category = await this.categoriesRepository.create({ name, user_id });

    await this.cacheProvider.invalidate(`categories-list:${user_id}`);

    return category;
  }
}

export default CreateCategoryService;
