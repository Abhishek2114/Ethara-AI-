const experimentsService = require("./experiments.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const list = catchAsync(async (req, res) => {
  const experiments = await experimentsService.listExperiments(req.query);
  sendSuccess(res, { data: { experiments } });
});

const getOne = catchAsync(async (req, res) => {
  const experiment = await experimentsService.getExperiment(req.params.id);
  sendSuccess(res, { data: { experiment } });
});

const create = catchAsync(async (req, res) => {
  const experiment = await experimentsService.createExperiment(req.body, req.user);
  sendSuccess(res, { statusCode: 201, data: { experiment } });
});

const update = catchAsync(async (req, res) => {
  const experiment = await experimentsService.updateExperiment(req.params.id, req.body);
  sendSuccess(res, { data: { experiment } });
});

const remove = catchAsync(async (req, res) => {
  await experimentsService.deleteExperiment(req.params.id);
  sendSuccess(res, { data: { message: "Experiment deleted" } });
});

module.exports = { list, getOne, create, update, remove };
