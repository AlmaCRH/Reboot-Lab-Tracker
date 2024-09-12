const Team = require("../models/team.model");

const getAllTeams = async (request, response) => {
  try {
    const Teams = await Team.findAll();
    return response.status(200).json(Teams);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const getTeam = async (request, response) => {
  try {
    const Team = await Team.findByPk(id);
    return response.status(200).json(Team);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const createTeam = async (request, response) => {
  try {
    const Team = await Team.create(request.body);
    return response.status(200).json(Team);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const updateTeam = async (request, response) => {
  try {
    const Team = Team.update(request.body, {
      where: {
        id: request.params.id,
      },
    });
    return response.status(200).json(Team);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const deleteTeam = async (request, response) => {
  try {
    await Team.destroy({
      where: {
        id: request.params.id,
      },
    });
    return response
      .status(200)
      .send(`Team with id ${request.params.id} was deleted`);
  } catch (error) {
    return response.status(501).send(error);
  }
};

module.exports = {
  getAllTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
};
