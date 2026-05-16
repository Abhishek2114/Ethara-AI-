const leaveService = require("./leave.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const list = catchAsync(async (req, res) => {
  const leaves = await leaveService.listLeaves(req.user, req.query);
  sendSuccess(res, { leaves, count: leaves.length });
});

const create = catchAsync(async (req, res) => {
  const leave = await leaveService.createLeave(req.user, req.body);
  sendSuccess(res, { statusCode: 201, data: { leave } });
});

const updateStatus = catchAsync(async (req, res) => {
  const leave = await leaveService.updateLeaveStatus(req.params.id, req.body.status, req.user);
  sendSuccess(res, { data: { leave } });
});

module.exports = { list, create, updateStatus };
