import { injectable, inject } from "tsyringe";
import Category from "../infra/typeorm/entities/Category";
import ICategoriesRepository from "../repositories/ICategoriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import AppError from "@shared/errors/AppError";

interface IRequest {
  name: string;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ name }: IRequest): Promise<Category> {
    let category = await this.categoriesRepository.findByName(name);

    if (category) throw new AppError("Categoria ja existente.", 400);

    category = await this.categoriesRepository.create({ name });

    await this.cacheProvider.invalidatePrefix("categories-list");

    return category;
  }
}

export default CreateCategoryService;
