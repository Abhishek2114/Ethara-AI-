const { catchAsync, sendSuccess } = require("../../core/http");
const service = require("./work-items.service");

const list = catchAsync(async (req, res) => {
  const items = await service.listForReview(req.user, {
    filter: req.query.filter,
    projectId: req.query.projectId,
  });
  sendSuccess(res, { items });
});

const review = catchAsync(async (req, res) => {
  const item = await service.reviewItem(req.params.id, req.user, req.body);
  sendSuccess(res, { item });
});

const listProjectItems = catchAsync(async (req, res) => {
  const items = await service.listByProject(req.params.projectId);
  sendSuccess(res, { items });
});

const create = catchAsync(async (req, res) => {
  const item = await service.createItem(req.user, req.body);
  sendSuccess(res, { statusCode: 201, data: { item } });
});

const updateStatus = catchAsync(async (req, res) => {
  const item = await service.updateStatus(req.params.id, req.user, req.body.status);
  sendSuccess(res, { item });
});

module.exports = { list, review, listProjectItems, create, updateStatus };
