import Category from "@modules/categories/infra/typeorm/entities/Category";
import ICreateCategoryDTO from "../dtos/ICreateCategoryDTO";
import IFindCategoryByNameAndUserIdDTO from "../dtos/IFindCategoryByNameAndUserIdDTO";

export default interface ICategoriesRepository {
  create(data: ICreateCategoryDTO): Promise<Category>;
  findAll(user_id: string): Promise<Category[]>;
  findById(category_id: string): Promise<Category | undefined>;
  findByNameAndUserId(
    data: IFindCategoryByNameAndUserIdDTO
  ): Promise<Category | undefined>;
  delete(category_id: string): Promise<void>;
  save(category: Category): Promise<Category>;
}
