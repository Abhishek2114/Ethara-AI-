const modelsService = require("./models.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const list = catchAsync(async (_req, res) => {
  const models = await modelsService.listModels();
  sendSuccess(res, { data: { models } });
});

const getOne = catchAsync(async (req, res) => {
  const model = await modelsService.getModel(req.params.id);
  sendSuccess(res, { data: { model } });
});

const create = catchAsync(async (req, res) => {
  const model = await modelsService.createModel(req.body, req.user);
  sendSuccess(res, { statusCode: 201, data: { model } });
});

const update = catchAsync(async (req, res) => {
  const model = await modelsService.updateModel(req.params.id, req.body);
  sendSuccess(res, { data: { model } });
});

const remove = catchAsync(async (req, res) => {
  await modelsService.deleteModel(req.params.id);
  sendSuccess(res, { data: { message: "Model removed" } });
});

module.exports = { list, getOne, create, update, remove };
