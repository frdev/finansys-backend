import { Router } from "express";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import EntriesController from "../controllers/EntriesController";
import { celebrate, Joi, Segments } from "celebrate";

const entriesRouter = Router();
const entriesController = new EntriesController();

entriesRouter.use(ensureAuthenticated);

entriesRouter.get(
  "/",
  celebrate({
    [Segments.QUERY]: {
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  entriesController.index
);

entriesRouter.get(
  "/:entry_id",
  celebrate({
    [Segments.PARAMS]: {
      entry_id: Joi.string().required(),
    },
  }),
  entriesController.show
);

entriesRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      category_id: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().required(),
      property: Joi.string().required(),
      date: Joi.date().required(),
    },
  }),
  entriesController.insert
);

entriesRouter.put(
  "/:entry_id",
  celebrate({
    [Segments.PARAMS]: {
      entry_id: Joi.string().required(),
    },
    [Segments.BODY]: {
      category_id: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().required(),
      property: Joi.string().required(),
      date: Joi.date().required(),
    },
  }),
  entriesController.update
);

entriesRouter.delete("/:entry_id", entriesController.delete);

export default entriesRouter;
