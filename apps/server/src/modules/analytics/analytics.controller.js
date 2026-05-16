const analyticsService = require("./analytics.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const team = catchAsync(async (req, res) => {
  const data = await analyticsService.getTeamAnalytics(req.user);
  sendSuccess(res, { data });
});

module.exports = { team };
