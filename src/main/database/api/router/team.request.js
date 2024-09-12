const router = require("express").Router();

const {
  getAllTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/team.controller");

router.get("/", getAllTeams);
router.get("/:id", getTeam);
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

module.exports = router;
