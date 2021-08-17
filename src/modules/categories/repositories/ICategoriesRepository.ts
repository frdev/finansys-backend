import Category from "@modules/categories/infra/typeorm/entities/Category";
import ICreateCategoryDTO from "../dtos/ICreateCategoryDTO";

export default interface ICategoriesRepository {
  create(data: ICreateCategoryDTO): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(category_id: string): Promise<Category | undefined>;
  findByName(category_id: string): Promise<Category | undefined>;
  delete(category_id: string): Promise<void>;
  save(category: Category): Promise<Category>;
}
