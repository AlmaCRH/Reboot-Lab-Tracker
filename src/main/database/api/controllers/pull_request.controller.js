const Pull_Request = require("../models/pull_request.model");

const getAllPull_Requests = async (request, response) => {
  try {
    const Pull_Requests = await Pull_Request.findAll();
    return response.status(200).json(Pull_Requests);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const getPull_Request = async (request, response) => {
  try {
    const Pull_Request = await Pull_Request.findByPk(id);
    return response.status(200).json(Pull_Request);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const createPull_Request = async (request, response) => {
  try {
    const Pull_Request = await Pull_Request.create(request.body);
    return response.status(200).json(Pull_Request);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const updatePull_Request = async (request, response) => {
  try {
    const Pull_Request = Pull_Request.update(request.body, {
      where: {
        id: request.params.id,
      },
    });
    return response.status(200).json(Pull_Request);
  } catch (error) {
    return response.status(501).send(error);
  }
};

const deletePull_Request = async (request, response) => {
  try {
    await Pull_Request.destroy({
      where: {
        id: request.params.id,
      },
    });
    return response
      .status(200)
      .send(`Pull_Request with id ${request.params.id} was deleted`);
  } catch (error) {
    return response.status(501).send(error);
  }
};

module.exports = {
  getAllPull_Requests,
  getPull_Request,
  createPull_Request,
  updatePull_Request,
  deletePull_Request,
};
