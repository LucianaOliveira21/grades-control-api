import express from "express";
import Controller from "../controllers/controller.js";

const router = express.Router();

const controller = new Controller();

router.post('/', controller.store);
router.put('/:id', controller.update);
router.delete("/:id", controller.delete);
router.get('/show/:id', controller.show);
router.get('/total', controller.total);
router.get('/avg', controller.avg);
router.get('/best-grades', controller.bestGrades);
router.get('/', controller.getAll);

export default router;
