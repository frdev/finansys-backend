import { injectable, inject } from "tsyringe";
import Category from "../infra/typeorm/entities/Category";
import ICategoriesRepository from "../repositories/ICategoriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import AppError from "@shared/errors/AppError";

interface IRequest {
  category_id: string;
  name: string;
}

@injectable()
class UpdateCategoryService {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ category_id, name }: IRequest): Promise<Category> {
    let categoryWithUpdatedName = await this.categoriesRepository.findByName(
      name
    );

    if (categoryWithUpdatedName && categoryWithUpdatedName.id !== category_id)
      throw new AppError("Nome de categoria já existente.", 400);

    const category = await this.categoriesRepository.findById(category_id);

    if (!category) throw new AppError("Id de categoria inexistente", 400);

    category.name = name;

    await this.categoriesRepository.save(category);

    await this.cacheProvider.invalidatePrefix("categories-list");

    return category;
  }
}

export default UpdateCategoryService;
