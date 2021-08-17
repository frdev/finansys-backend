import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import CategoriesController from "../controllers/CategoriesController";

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

categoriesRouter.get("/", categoriesController.index);

categoriesRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  categoriesController.insert
);

categoriesRouter.put(
  "/:category_id",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  categoriesController.update
);

categoriesRouter.delete("/:category_id", categoriesController.delete);

export default categoriesRouter;
