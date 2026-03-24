import { Router } from "express";
import healthRouter from "./health";
import agreementsRouter from "./agreements";
import assetsRouter from "./assets";

const router = Router();

router.use(healthRouter);
router.use(agreementsRouter);
router.use(assetsRouter);

export default router;
