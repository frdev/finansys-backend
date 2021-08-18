import { injectable, inject } from "tsyringe";
import Category from "@modules/categories/infra/typeorm/entities/Category";
import ICategoriesRepository from "../repositories/ICategoriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { classToClass } from "class-transformer";
import _ from "lodash";

@injectable()
class ListCategoriesService {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute(user_id: string): Promise<Category[]> {
    const keyCache = `categories-list:${user_id}`;

    let categories = await this.cacheProvider.recover<Category[]>(keyCache);

    if (!categories) {
      categories = await this.categoriesRepository.findAll(user_id);

      categories = classToClass(_.orderBy(categories, ["name"], ["asc"]));

      await this.cacheProvider.save(keyCache, categories);
    }

    return categories;
  }
}

export default ListCategoriesService;
