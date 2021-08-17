import ICreateCategoryDTO from "@modules/categories/dtos/ICreateCategoryDTO";
import ICategoriesRepository from "@modules/categories/repositories/ICategoriesRepository";
import { getRepository, Repository } from "typeorm";
import Category from "../entities/Category";

class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async create({ name }: ICreateCategoryDTO): Promise<Category> {
    const category = this.ormRepository.create({ name });

    await this.save(category);

    return category;
  }

  public async findAll(): Promise<Category[]> {
    const categories = await this.ormRepository.find();

    return categories;
  }

  public async findById(category_id: string): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne(category_id);

    return category;
  }

  public async findByName(name: string): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne({
      where: { name },
    });

    return category;
  }

  public async delete(category_id: string): Promise<void> {
    await this.ormRepository.delete(category_id);
  }

  public async save(category: Category): Promise<Category> {
    return this.ormRepository.save(category);
  }
}

export default CategoriesRepository;
