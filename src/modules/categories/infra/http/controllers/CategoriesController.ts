import { container } from "tsyringe";
import { Request, Response } from "express";
import ListCategoriesService from "@modules/categories/services/ListCategoriesService";
import CreateCategoryService from "@modules/categories/services/CreateCategoryService";
import UpdateCategoryService from "@modules/categories/services/UpdateCategoryService";
import DeleteCategoryService from "@modules/categories/services/DeleteCategoryService";

export default class CategoriesController {
  public async index(_: Request, response: Response): Promise<Response> {
    const listCategories = container.resolve(ListCategoriesService);

    const categories = await listCategories.execute();

    return response.json(categories);
  }

  public async insert(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCategory = container.resolve(CreateCategoryService);

    const category = await createCategory.execute({ name });

    return response.send(201).json(category);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { category_id } = request.params;
    const { name } = request.body;

    const updateCategory = container.resolve(UpdateCategoryService);

    const category = await updateCategory.execute({ category_id, name });

    return response.json(category);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { category_id } = request.params;

    const deleteCategory = container.resolve(DeleteCategoryService);

    await deleteCategory.execute(category_id);

    return response.send(204).json({ message: "Categoria deletada" });
  }
}
