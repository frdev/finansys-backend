import { injectable, inject } from "tsyringe";
import Category from "../infra/typeorm/entities/Category";
import ICategoriesRepository from "../repositories/ICategoriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import _ from "lodash";

@injectable()
class ListCategoriesService {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute(): Promise<Category[]> {
    const keyCache = `categories-list:1`;

    let categories = await this.cacheProvider.recover<Category[]>(keyCache);

    if (!categories) {
      categories = await this.categoriesRepository.findAll();

      categories = _.orderBy(categories, ["name"], ["asc"]);

      await this.cacheProvider.save(keyCache, categories);
    }

    return categories;
  }
}

export default ListCategoriesService;
