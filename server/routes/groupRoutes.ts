import {  Router } from "express";
import { getAllGroups } from "../controllers/groupControllers/getAllGroups";
const router = Router();

router.get("/",getAllGroups);




export {router as groupRoutes};
