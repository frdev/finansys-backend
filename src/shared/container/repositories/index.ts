import { container } from "tsyringe";

import CategoriesRepository from "@modules/categories/infra/typeorm/repositories/CategoriesRepository";
import ICategoriesRepository from "@modules/categories/repositories/ICategoriesRepository";

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
);
