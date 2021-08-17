import { Router } from "express";
import categoriesRoutes from "@modules/categories/infra/http/routes/categories.routes";

const router = Router();

router.use("/categories", categoriesRoutes);

export default router;
