const teamService = require("./team.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const list = catchAsync(async (req, res) => {
  const team = await teamService.listTeam(req.user);
  sendSuccess(res, { data: { team } });
});

module.exports = { list };
