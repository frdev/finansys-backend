import ICreateCategoryDTO from "@modules/categories/dtos/ICreateCategoryDTO";
import IFindCategoryByNameAndUserIdDTO from "@modules/categories/dtos/IFindCategoryByNameAndUserIdDTO";
import ICategoriesRepository from "@modules/categories/repositories/ICategoriesRepository";
import { getRepository, Repository } from "typeorm";
import Category from "@modules/categories/infra/typeorm/entities/Category";

class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async create({
    name,
    user_id,
  }: ICreateCategoryDTO): Promise<Category> {
    const category = this.ormRepository.create({ name, user_id });

    await this.save(category);

    return category;
  }

  public async findAll(user_id: string): Promise<Category[]> {
    const categories = await this.ormRepository.find({
      where: { user_id },
    });

    return categories;
  }

  public async findById(category_id: string): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne(category_id);

    return category;
  }

  public async findByNameAndUserId({
    name,
    user_id,
  }: IFindCategoryByNameAndUserIdDTO): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne({
      where: { name, user_id },
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
