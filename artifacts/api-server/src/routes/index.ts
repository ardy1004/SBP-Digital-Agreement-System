import { Router, type IRouter } from "express";
import healthRouter from "./health";
import agreementsRouter from "./agreements";

const router: IRouter = Router();

router.use(healthRouter);
router.use(agreementsRouter);

export default router;
