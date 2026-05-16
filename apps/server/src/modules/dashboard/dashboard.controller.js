const dashboardService = require("./dashboard.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const stats = catchAsync(async (req, res) => {
  const data = await dashboardService.getStats(req.user);
  sendSuccess(res, { data });
});

module.exports = { stats };
