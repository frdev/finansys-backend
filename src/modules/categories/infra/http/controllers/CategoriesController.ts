import { container } from "tsyringe";
import { Request, Response } from "express";
import ListCategoriesService from "@modules/categories/services/ListCategoriesService";
import CreateCategoryService from "@modules/categories/services/CreateCategoryService";
import UpdateCategoryService from "@modules/categories/services/UpdateCategoryService";
import DeleteCategoryService from "@modules/categories/services/DeleteCategoryService";
import { classToClass } from "class-transformer";

export default class CategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listCategories = container.resolve(ListCategoriesService);

    const categories = await listCategories.execute(user_id);

    return response.json(categories);
  }

  public async insert(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name } = request.body;

    const createCategory = container.resolve(CreateCategoryService);

    const category = await createCategory.execute({ name, user_id });

    return response.json(category);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { category_id } = request.params;
    const { name } = request.body;

    const updateCategory = container.resolve(UpdateCategoryService);

    const category = await updateCategory.execute({
      category_id,
      name,
      user_id,
    });

    return response.json(classToClass(category));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { category_id } = request.params;

    const deleteCategory = container.resolve(DeleteCategoryService);

    await deleteCategory.execute({ user_id, category_id });

    return response.send(204).json({ message: "Categoria deletada" });
  }
}
