import { Router, type IRouter } from "express";
import healthRouter from "./health";
import moviesRouter from "./movies";
import authRouter from "./auth";
import profilesRouter from "./profiles";

const router: IRouter = Router();

router.use(healthRouter);
router.use(moviesRouter);
router.use(authRouter);
router.use(profilesRouter);

export default router;