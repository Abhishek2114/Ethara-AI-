const taskersService = require("./taskers.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const list = catchAsync(async (req, res) => {
  const taskers = await taskersService.listTaskers(req.user);
  sendSuccess(res, { data: { taskers } });
});

module.exports = { list };
