const router = require("express").Router();

const {
  getAllPull_Requests,
  getPull_Request,
  createPull_Request,
  updatePull_Request,
  deletePull_Request,
} = require("../controllers/pull_request.controller");

router.get("/", getAllPull_Requests);
router.get("/:id", getPull_Request);
router.post("/", createPull_Request);
router.put("/:id", updatePull_Request);
router.delete("/:id", deletePull_Request);

module.exports = router;
