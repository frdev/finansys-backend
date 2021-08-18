import { container } from "tsyringe";

import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import CategoriesRepository from "@modules/categories/infra/typeorm/repositories/CategoriesRepository";
import ICategoriesRepository from "@modules/categories/repositories/ICategoriesRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
);
