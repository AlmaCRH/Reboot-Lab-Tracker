const Lab = require("../models/lab.model");

const getAllLabs = async (request, response) => {
  try {
    const Labs = await Lab.findAll();
    return response.status(200).json(Labs);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const getLab = async (request, response) => {
  try {
    const Lab = await Lab.findByPk(id);
    return response.status(200).json(Lab);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const createLab = async (request, response) => {
  try {
    const Lab = await Lab.create(request.body);
    return response.status(200).json(Lab);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const updateLab = async (request, response) => {
  try {
    const Lab = Lab.update(request.body, {
      where: {
        id: request.params.id,
      },
    });
    return response.status(200).json(Lab);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const deleteLab = async (request, response) => {
  try {
    await Lab.destroy({
      where: {
        id: request.params.id,
      },
    });
    return response
      .status(200)
      .send(`Lab with id ${request.params.id} was deleted`);
  } catch (error) {
    return response.status(501).send(error);
  }
};

module.exports = {
  getAllLabs,
  getLab,
  createLab,
  updateLab,
  deleteLab,
};
