const tasksService = require("./tasks.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const list = catchAsync(async (req, res) => {
  const tasks = await tasksService.listTasks(req.user, req.query);
  sendSuccess(res, { data: { tasks } });
});

const getOne = catchAsync(async (req, res) => {
  const task = await tasksService.getTask(req.params.id, req.user);
  sendSuccess(res, { data: { task } });
});

const create = catchAsync(async (req, res) => {
  const task = await tasksService.createTask(req.body, req.user);
  sendSuccess(res, { statusCode: 201, data: { task } });
});

const update = catchAsync(async (req, res) => {
  const task = await tasksService.updateTask(req.params.id, req.body, req.user);
  sendSuccess(res, { data: { task } });
});

const remove = catchAsync(async (req, res) => {
  await tasksService.deleteTask(req.params.id, req.user);
  sendSuccess(res, { data: { message: "Task deleted" } });
});

const reorder = catchAsync(async (req, res) => {
  const tasks = await tasksService.reorderTasks(req.body.updates, req.user);
  sendSuccess(res, { data: { tasks } });
});

module.exports = { list, getOne, create, update, remove, reorder };
