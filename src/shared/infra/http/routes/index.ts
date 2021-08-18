import { Router } from "express";
import usersRoutes from "@modules/users/infra/http/routes/users.routes";
import sessionsRoutes from "@modules/users/infra/http/routes/sessions.routes";
import categoriesRoutes from "@modules/categories/infra/http/routes/categories.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/categories", categoriesRoutes);

export default router;
